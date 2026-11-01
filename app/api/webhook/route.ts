import { NextRequest, NextResponse } from 'next/server';
import { generateAIDraft } from '@/lib/llm';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

function getConversationUUID(customerOrConvId?: string): string {
  if (!customerOrConvId) return '10420000-0000-0000-0000-000000001042';

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(customerOrConvId)) return customerOrConvId;

  if (customerOrConvId.includes('1043') || customerOrConvId.includes('rohan') || customerOrConvId.includes('Rohan')) {
    return '10430000-0000-0000-0000-000000001043';
  }
  if (customerOrConvId.includes('1044') || customerOrConvId.includes('priya') || customerOrConvId.includes('Priya')) {
    return '10440000-0000-0000-0000-000000001044';
  }

  return '10420000-0000-0000-0000-000000001042';
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      console.warn("No JSON payload found in body, using default test payload.");
    }

    const customer = body?.customer || {};
    const message = body?.message || {};

    const customerId = customer?.id || 'cust_1042';
    const customerName = customer?.name || 'Aisha Khan';
    const customerPhone = customer?.phone || '+919800000001';

    const conversationId = getConversationUUID(message?.conversation_id || customerId);
    const messageId = crypto.randomUUID();
    const messageText = message?.text || 'Default message text';

    const draftText = await generateAIDraft(messageText);

    const { error: custErr } = await supabase
      .from('customers')
      .upsert({ id: customerId, name: customerName, phone: customerPhone }, { onConflict: 'id' });
    if (custErr) console.error("Customer DB Error:", custErr);

    const { error: convErr } = await supabase
      .from('conversations')
      .upsert({
        id: conversationId,
        customer_id: customerId,
        status: 'open',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    if (convErr) console.error("Conversation DB Error:", convErr);

    const { data: msgData, error: msgErr } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        conversation_id: conversationId,
        sender_type: 'customer',
        text: messageText,
        ai_draft: draftText,
        is_draft_approved: false,
        created_at: new Date().toISOString(),
      })
      .select();

    if (msgErr) {
      console.error("Message DB Insert Error:", msgErr);
      return NextResponse.json({ error: msgErr.message }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      conversation_id: conversationId,
      customer_name: customerName,
      ai_draft: draftText,
      data: msgData,
    });
  } catch (error: any) {
    console.error("Webhook Execution Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}