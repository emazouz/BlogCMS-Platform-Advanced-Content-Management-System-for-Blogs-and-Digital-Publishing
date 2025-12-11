export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          Please read these terms and conditions carefully before using Our
          Service.
        </p>
        <h2>Acknowledgment</h2>
        <p>
          These are the Terms and Conditions governing the use of this Service
          and the agreement that operates between You and the Company. These
          Terms and Conditions set out the rights and obligations of all users
          regarding the use of the Service.
        </p>
        <h2>Content</h2>
        <p>
          Our Service allows You to post, link, store, share and otherwise make
          available certain information, text, graphics, videos, or other
          material. You are responsible for the Content that You post to the
          Service.
        </p>
        {/* Add more generic terms content here */}
      </div>
    </div>
  );
}
