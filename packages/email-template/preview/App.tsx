import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { render } from "@react-email/render";
import { WelcomeEmail } from "../src/emails";

function App() {
    const [html, setHtml] = useState("<p>Chargement...</p>");

    useEffect(() => {
        async function generate() {
            const result = await render(<WelcomeEmail username="Alice" email="a@a.com" confirmUrl="https://example.com/confirm" />);
            setHtml(result);
        }
        generate();
    }, []);
    return (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
