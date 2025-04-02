import { useEffect } from 'react';

const CustomDialogflowMessenger = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
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