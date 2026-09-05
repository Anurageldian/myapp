import React, { useState } from 'react';
import { 
  TonConnectButton, 
  TonConnectUIProvider, 
  useTonAddress, 
  useTonWallet 
} from '@tonconnect/ui-react';

interface ChatMessage {
  id: string;
  senderAddress: string;
  text: string;
  timeString: string;
}

function MessengerChat() {
  const userAddress = useTonAddress();
  const wallet = useTonWallet();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderAddress: 'EQSystemNotificationAddressMock...00',
      text: 'Welcome to My App! Your connected TON public address is now your permanent chat identity.',
      timeString: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userAddress) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderAddress: userAddress,
      text: inputText,
      timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>My App</h1>
          <p style={styles.statusText}>
            {wallet ? '🟢 Wallet Active' : '🔴 Connect Wallet to Chat'}
          </p>
        </div>
        <TonConnectButton />
      </header>

      {!userAddress ? (
        <div style={styles.welcomeScreen}>
          <div style={styles.welcomeCard}>
            <h3>Decentralized Identity</h3>
            <p style={styles.welcomeSubtext}>
              No passwords, emails, or phone numbers required. Connect your wallet to chat directly via your public address.
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.chatArea}>
          <div style={styles.identityPill}>
            <span style={styles.pillLabel}>Active Identity:</span>
            <span style={styles.pillAddress}>
              {userAddress.slice(0, 6)}...{userAddress.slice(-6)}
            </span>
          </div>

          <div style={styles.messageStream}>
            {messages.map((msg) => {
              const isCurrentUser = msg.senderAddress === userAddress;
              return (
                <div 
                  key={msg.id} 
                  style={{ 
                    ...styles.bubble, 
                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start', 
                    backgroundColor: isCurrentUser ? '#2b4c7e' : '#2d3748' 
                  }}
                >
                  <div style={styles.bubbleSender}>
                    {isCurrentUser ? 'You' : `${msg.senderAddress.slice(0, 4)}...${msg.senderAddress.slice(-4)}`}
                  </div>
                  <div style={styles.bubbleText}>{msg.text}</div>
                  <div style={styles.bubbleTime}>{msg.timeString}</div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} style={styles.inputForm}>
            <input
              type="text"
              placeholder="Send message as your wallet address..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={styles.textInput}
            />
            <button type="submit" style={styles.sendBtn}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://anurageldian.github.io/my-app/tonconnect-manifest.json">
      <MessengerChat />
    </TonConnectUIProvider>
  );
}

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column' as const, height: '100vh', backgroundColor: '#121824', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#1a2332', borderBottom: '1px solid #2a374c' },
  title: { margin: 0, fontSize: '18px', fontWeight: 'bold' as const },
  statusText: { margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' },
  welcomeScreen: { display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', padding: '24px' },
  welcomeCard: { backgroundColor: '#1a2332', padding: '24px', borderRadius: '12px', textAlign: 'center' as const, maxWidth: '320px', border: '1px solid #2a374c' },
  welcomeSubtext: { color: '#94a3b8', fontSize: '13px', marginTop: '8px', lineHeight: '1.4' },
  chatArea: { display: 'flex', flexDirection: 'column' as const, flex: 1, padding: '12px', overflow: 'hidden' },
  identityPill: { backgroundColor: '#1a2332', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', border: '1px solid #2a374c' },
  pillLabel: { color: '#94a3b8' },
  pillAddress: { fontFamily: 'monospace', color: '#38bdf8', fontWeight: 'bold' as const },
  messageStream: { display: 'flex', flexDirection: 'column' as const, flex: 1, overflowY: 'auto' as const, gap: '8px', paddingBottom: '8px' },
  bubble: { maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', wordBreak: 'break-word' as const },
  bubbleSender: { fontSize: '10px', color: '#cbd5e1', marginBottom: '3px', fontWeight: 'bold' as const },
  bubbleText: { fontSize: '14px', lineHeight: '1.3' },
  bubbleTime: { fontSize: '9px', color: '#94a3b8', textAlign: 'right' as const, marginTop: '4px' },
  inputForm: {display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' },
  textInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #2a374c', backgroundColor: '#1a2332', color: '#fff', outline: 'none', fontSize: '14px' },
  sendBtn: { padding: '0 18px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' as const, cursor: 'pointer' }
};
