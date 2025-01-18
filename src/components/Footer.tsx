import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">AI Platform</h3>
            <p className="text-sm">
              Next-generation AI powered by advanced language models, helping you solve complex problems.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Features
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Pricing
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  API
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  About
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Blog
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Careers
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Privacy
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Terms
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2024 AI Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};