export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        <p>
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>
        {/* Add more generic privacy policy content here or use a generator */}
        <p>
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information.
        </p>
        <h2>AdSense</h2>
        <p>
          We use Google AdSense to display ads on our website. Google AdSense
          uses cookies to serve ads based on a user&apos;s prior visits to your
          website or other websites. Google&apos;s use of advertising cookies enables
          it and its partners to serve ads to your users based on their visit to
          your sites and/or other sites on the Internet.
        </p>
      </div>
    </div>
  );
}
