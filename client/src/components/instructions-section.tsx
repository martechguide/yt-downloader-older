import { Card, CardContent } from "@/components/ui/card";

export default function InstructionsSection() {
  const steps = [
    {
      number: 1,
      title: "Paste YouTube URL",
      description: "Copy and paste the YouTube video URL into the input field above",
    },
    {
      number: 2,
      title: "Choose Quality",
      description: "Select your preferred audio quality from 128kbps to 320kbps",
    },
    {
      number: 3,
      title: "Download MP3",
      description: "Click convert and download your high-quality MP3 file",
    },
  ];

  return (
    <Card className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Use</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
