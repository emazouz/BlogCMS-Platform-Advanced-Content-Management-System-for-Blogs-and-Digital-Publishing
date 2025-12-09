import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  async function handleSubmit(formData: FormData) {
    "use server";
    // Implement email sending logic here
    console.log("Contact form submitted");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input name="name" placeholder="Your Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            name="message"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="How can we help?"
            required
          ></textarea>
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  );
}
