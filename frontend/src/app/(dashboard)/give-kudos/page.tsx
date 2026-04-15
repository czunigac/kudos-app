import { GiveKudosForm } from "@/components/kudos/GiveKudosForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function GiveKudosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Give kudos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recognize a teammate and let Kudos Coach refine your message.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0">
          <GiveKudosForm />
        </div>

        <aside className="min-w-0 space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden />
                Kudos Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                After you write at least ten characters, the coach analyzes your
                draft and suggests a category, an optional recipient, a polished
                message, and quick improvements.
              </p>
              <p>
                Suggestions stream in as they are generated—watch for the
                subtle pulse while the coach is working.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
