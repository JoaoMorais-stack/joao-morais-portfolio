// Página "/" da exportação estática: escolhe o idioma pelo navegador e redireciona.
// Sem JavaScript, o meta refresh leva para a versão em português.
const pick = `(function(){try{var l=(navigator.languages&&navigator.languages[0])||navigator.language||"pt";location.replace(/^pt/i.test(l)?"./pt/":"./en/")}catch(e){location.replace("./pt/")}})();`;

export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="1; url=./pt/" />
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <p style={{ padding: 24 }}>
        <a href="./pt/" style={{ color: "inherit" }}>Português</a> · <a href="./en/" style={{ color: "inherit" }}>English</a>
      </p>
    </>
  );
}
