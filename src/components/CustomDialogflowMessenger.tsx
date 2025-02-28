import { useEffect } from 'react';

const CustomDialogflowMessenger = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    const style = document.createElement('style');
    style.textContent = `
      df-messenger {
        z-index: 999;
        position: fixed;
        bottom: 16px;
        right: 16px;
      }

      df-messenger {
        --df-messenger-bot-message: #f5f5f5;
        --df-messenger-button-titlebar-color: hsl(var(--primary));
        --df-messenger-chat-background-color: #fafafa;
        --df-messenger-font-color: hsl(var(--foreground));
        --df-messenger-send-icon: hsl(var(--primary));
        --df-messenger-user-message: hsl(var(--primary));
        --df-messenger-minimized-chat-close-icon-color: hsl(var(--primary));
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <df-messenger
      intent="WELCOME"
      chat-title="TalentHub"
      agent-id="d894e0ad-b694-4681-94f7-37ae8f0f5557"
      language-code="vi"
      chat-icon="/favicon.png"
    ></df-messenger>
  );
};

export default CustomDialogflowMessenger;