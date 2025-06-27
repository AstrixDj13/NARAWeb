import { useState, useRef, useEffect } from "react";
export default function ProductDescriptionIframe({ product }) {
    const [iframeSrc, setIframeSrc] = useState("");
    const iframeRef = useRef(null);
  
    useEffect(() => {
      if (product?.descriptionHtml) {
        const htmlContent = `
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 10px;
                }
              </style>
              <script>
                function sendHeight() {
                  const height = document.body.scrollHeight;
                  window.parent.postMessage({ iframeHeight: height }, '*');
                }
                window.onload = sendHeight;
                window.onresize = sendHeight;
              </script>
            </head>
            <body>${product?.descriptionHtml}</body>
          </html>
        `;
  
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setIframeSrc(url);
  
        return () => URL.revokeObjectURL(url);
      }
    }, [product]);
  
    useEffect(() => {
      const handleMessage = (event) => {
        if (event.data?.iframeHeight && iframeRef.current) {
          iframeRef.current.style.height = `${event.data?.iframeHeight}px`;
        }
      };
  
      window.addEventListener("message", handleMessage);
  
      return () => window.removeEventListener("message", handleMessage);
    }, []);
  
    return (
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Product Description"
        className="w-full border-none"
        style={{ height: "auto", overflow: "hidden" }}
      />
    );
  }
  