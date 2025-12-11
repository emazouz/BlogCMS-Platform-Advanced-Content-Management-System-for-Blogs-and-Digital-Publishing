export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          This Cookie Policy explains what cookies are, how we use them, and
          your choices regarding their use.
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device (computer,
          smartphone, or tablet) when you visit a website. They help the website
          function properly, make it more secure, provide better user
          experience, and understand how the website performs.
        </p>

        <h2>How We Use Cookies</h2>
        <p>We use the following types of cookies:</p>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> These are necessary for the
            website to function (e.g., authentication).
          </li>
          <li>
            <strong>Analytics Cookies:</strong> These help us understand how
            visitors interact with the website.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> We use Google AdSense to serve
            personalized ads. These cookies track your browsing habits to show
            relevant advertisements.
          </li>
        </ul>

        <h2>Google AdSense</h2>
        <p>
          We use Google AdSense to publish ads on this site. When you view or
          click on an ad, a cookie will be set to help better provide
          advertisements that may be of interest to you on this and other
          websites. You may opt-out of the use of this cookie by visiting
          Google&apos;s Advertising and Privacy Policies.
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can change your cookie preferences at any time by deleting cookies
          from your browser history or changing your browser&apos;s privacy
          settings.
        </p>
      </div>
    </div>
  );
}
