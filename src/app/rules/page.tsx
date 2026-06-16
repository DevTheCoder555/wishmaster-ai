import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, AlertTriangle, ListChecks } from 'lucide-react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Platform Rules & Guidelines</h1>
        <p className="text-white/60">Please read carefully before creating or contributing to wishes.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400"><AlertTriangle className="h-5 w-5" /> Before Creating a Wish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-white/80">
          <ul className="list-disc pl-5 space-y-2">
            <li>You <strong>cannot</strong> fulfill your own wish under any circumstances.</li>
            <li>Wishes must be genuine and legal.</li>
            <li>Fake, misleading, or fraudulent wishes are strictly prohibited.</li>
            <li>The platform reserves the right to reject any wish that violates policies.</li>
            <li>Contributions are non-refundable unless specified by platform policy.</li>
            <li>Funds are used <strong>only</strong> for fulfilling approved wishes.</li>
            <li>Fulfillment occurs <strong>only</strong> through affiliate purchases. The platform does not transfer cash directly to users.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary"><ListChecks className="h-5 w-5" /> How Wish Fulfillment Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-3 text-white/80">
            <li><strong>Step 1:</strong> User creates a wish with a target amount.</li>
            <li><strong>Step 2:</strong> Other users contribute by scanning the platform QR code and submitting proof.</li>
            <li><strong>Step 3:</strong> Admin verifies the payment. When the target is reached, the wish is marked "Funding Complete".</li>
            <li><strong>Step 4:</strong> The wish creator submits a "Fulfillment Request".</li>
            <li><strong>Step 5:</strong> Admin reviews and approves the request.</li>
            <li><strong>Step 6:</strong> Admin places the order through the designated affiliate link.</li>
            <li><strong>Step 7:</strong> Admin marks the wish as "Fulfilled".</li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Link href="/create-wish">
          <Button size="lg" className="flex items-center gap-2 mx-auto">
            <ShieldCheck className="h-5 w-5" /> I Understand, Create a Wish
          </Button>
        </Link>
      </div>
    </div>
  );
}