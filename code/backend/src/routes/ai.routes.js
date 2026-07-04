const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { chatSchema } = require('../validators');
const { queryRAG } = require('../rag');

/**
 * GET /api/ai/sessions
 * Get all chat sessions for a user
 */
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const result = await db.query(
      'SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY updated_date DESC',
      [uid]
    );
    res.json({ success: true, sessions: result.rows });
  } catch (error) {
    console.error('Error fetching sessions:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/ai/sessions
 * Create a new chat session
 */
router.post('/sessions', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const title = req.body.title || 'New Chat';
    const result = await db.query(
      'INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING *',
      [uid, title]
    );
    res.json({ success: true, session: result.rows[0] });
  } catch (error) {
    console.error('Error creating session:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/ai/sessions/:sessionId/messages
 * Get all messages for a session
 */
router.get('/sessions/:sessionId/messages', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { sessionId } = req.params;
    
    const sessionRes = await db.query('SELECT user_id FROM chat_sessions WHERE session_id = $1', [sessionId]);
    if (sessionRes.rows.length === 0 || sessionRes.rows[0].user_id !== uid) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const messagesRes = await db.query(
      'SELECT sender, text, created_date FROM chat_messages WHERE session_id = $1 ORDER BY created_date ASC',
      [sessionId]
    );
    res.json({ success: true, messages: messagesRes.rows });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/ai/chat
 * AI chatbot endpoint. Uses Groq LLM + RAG (ChromaDB) to provide
 * Shariah-compliant financial advice grounded in the actual PDF content.
 * Persists the advice record in PostgreSQL.
 */
router.post('/chat', authMiddleware, validate(chatSchema), async (req, res) => {
  const { message, history, userId, sessionId } = req.body;

  // ── 0. Save user message to chat_messages if session exists ──
  if (sessionId) {
    try {
      await db.query(
        'INSERT INTO chat_messages (session_id, sender, text) VALUES ($1, $2, $3)',
        [sessionId, 'user', message]
      );
    } catch(err) {
      console.error('Failed to save user message:', err.message);
    }
  }

  // ── 1. Fetch user's financial profile from PostgreSQL ──
  let userProfileText = "No financial profile available.";
  if (userId) {
    try {
      const profileRes = await db.query('SELECT * FROM financial_profiles WHERE user_id = $1', [userId]);
      if (profileRes.rows.length > 0) {
        const p = profileRes.rows[0];
        userProfileText = `User Financial Profile:\n- Monthly Income: $${p.income || 0}\n- Total Assets: $${p.assets || 0}\n- Total Liabilities: $${p.liabilities || 0}\n- Current Savings: $${p.savings || 0}\n`;
      }
    } catch (err) {
      console.error("Error fetching profile for LLM context:", err.message);
    }
  }

  // ── 2. Retrieve relevant Shariah rules from PostgreSQL ──
  let dbRulesText = "";
  try {
    const rulesRes = await db.query('SELECT category, description, source_reference FROM shariah_rules LIMIT 20');
    if (rulesRes.rows.length > 0) {
      dbRulesText = "\nSHARIAH RULES FROM DATABASE:\n" +
        rulesRes.rows.map(r => `- [${r.category}] ${r.description} (Source: ${r.source_reference || 'N/A'})`).join('\n');
    }
  } catch (err) {
    console.error("Error fetching Shariah rules:", err.message);
  }

  // ── 3. Query ChromaDB RAG for relevant PDF passages ──
  let ragContext = "";
  try {
    const passages = await queryRAG(message, 5);
    if (passages.length > 0) {
      ragContext = "\nRETRIEVED SHARIAH KNOWLEDGE FROM PDF:\n" +
        passages.map((p, i) => `[Passage ${i + 1}]: ${p}`).join('\n\n');
    }
  } catch (err) {
    console.error("RAG query error:", err.message);
  }

  // ── 4. Build the system prompt ──
  const systemInstructionText = `You are ITQAN, a highly knowledgeable, compassionate, and professional AI Islamic Finance Advisor. Your primary directive is to help users manage their personal finances, analyze investments for Shariah compliance, calculate Zakat, and plan budgets strictly aligned with Islamic principles. 
  
CRITICAL ISLAMIC PRINCIPLES:
1. Riba (Usury/Interest): Strictly prohibit any involvement in interest-bearing loans, conventional bonds, or high-yield savings accounts. Always suggest Halal alternatives like Sukuk, Musharaka, or Murabaha.
2. Gharar (Excessive Uncertainty) & Maysir (Gambling): Warn against options trading, excessive speculation, crypto day-trading, and conventional insurance (suggest Takaful instead).
3. Halal Sectors: Prohibit investments in alcohol, pork, gambling, adult entertainment, and conventional banking.

IMPORTANT INSTRUCTIONS:
- You MUST base your answers on the retrieved Shariah knowledge passages below. Do NOT make up Islamic rulings.
- If the retrieved passages contain relevant information, cite them in your response.
- If the question is outside the scope of the retrieved knowledge, say so honestly and recommend consulting a qualified Islamic scholar.
- Always provide the Islamic source reference when available.

USER CONTEXT:
${userProfileText}
${dbRulesText}
${ragContext}

TONE:
Always speak with immense respect and professionalism. Use Islamic greetings like "Assalamu alaikum" when appropriate. Do not preach, but explain financial rules clearly and logically. Use bullet points and bold text to make your advice readable. Keep answers structured and actionable.`;

  // ── 5. Call Groq API ──
  let responseText = "";
  const groqApiKey = process.env.GROQ_API_KEY;

  if (groqApiKey && groqApiKey !== 'your_groq_api_key_here') {
    try {
      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach(msg => {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          });
        });
      }
      contents.push({
        role: 'user',
        content: message,
      });

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemInstructionText },
            ...contents,
          ],
          temperature: 0.3,
          max_tokens: 2048,
        }),
      });

      const groqData = await groqRes.json();
      if (groqData.choices && groqData.choices[0]?.message?.content) {
        responseText = groqData.choices[0].message.content;
      } else {
        console.error("Groq API Error:", JSON.stringify(groqData, null, 2));
        throw new Error('Invalid Groq API response structure');
      }
    } catch (error) {
      console.error('Groq API call failed, falling back to mock rules:', error.message);
    }
  }

  // ── 6. Fallback engine if Groq is not configured or fails ──
  if (!responseText) {
    await new Promise(resolve => setTimeout(resolve, 800));

    responseText = "Assalamu alaikum. I am the ITQAN AI Advisor. (Note: The LLM API key is currently missing or invalid, so I am running in fallback mode).\n\nTo provide a comprehensive Shariah-compliant response to your query regarding '" + message + "', remember to follow the core principles of avoiding Riba (interest), Gharar (uncertainty), and Maysir (gambling).";

    if (message.toLowerCase().includes('bond')) {
      responseText = "Assalamu alaikum. Standard conventional bonds involve guaranteed interest (Riba) which is strictly prohibited in Islam. Consider exploring **Sukuk** instead, which represents ownership in an underlying asset and shares both risk and reward.";
    } else if (message.toLowerCase().includes('zakat')) {
      responseText = "Assalamu alaikum. **Zakat** is calculated at 2.5% of your qualifying wealth held for a full lunar year (Hawl) once it exceeds the Nisab threshold.\n\nI recommend using the **Zakat Calculator** tool in the dashboard to get precise figures based on your current liquid assets and liabilities.";
    } else if (message.toLowerCase().includes('crypto') || message.toLowerCase().includes('bitcoin')) {
      responseText = "Assalamu alaikum. Cryptocurrency is a debated topic among Islamic scholars. While the underlying blockchain technology is generally permissible, coins that lack utility, rely heavily on speculation (Gharar), or promise fixed returns (Riba) are strictly prohibited. Always look for crypto assets backed by tangible utility.";
    }
  }

  // ── 7. Store the generated advice in PostgreSQL for auditing ──
  if (userId) {
    try {
      await db.query(
        `INSERT INTO advice (user_id, advice_type, description)
         VALUES ($1, 'chatbot', $2)`,
        [userId, responseText]
      );
    } catch (error) {
      console.error('Failed to store advice in DB:', error.message);
    }
  }

  // ── 8. Save AI message to chat_messages and update session ──
  if (sessionId) {
    try {
      await db.query(
        'INSERT INTO chat_messages (session_id, sender, text) VALUES ($1, $2, $3)',
        [sessionId, 'ai', responseText]
      );
      
      // Update session title if it's new
      const titleRes = await db.query('SELECT title FROM chat_sessions WHERE session_id = $1', [sessionId]);
      if (titleRes.rows.length > 0 && titleRes.rows[0].title === 'New Chat') {
         const generatedTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
         await db.query('UPDATE chat_sessions SET title = $1, updated_date = NOW() WHERE session_id = $2', [generatedTitle, sessionId]);
      } else {
         await db.query('UPDATE chat_sessions SET updated_date = NOW() WHERE session_id = $1', [sessionId]);
      }
    } catch(err) {
      console.error('Failed to save AI message:', err.message);
    }
  }

  res.json({ success: true, reply: responseText });
});

module.exports = router;
