import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MockNotFoundA() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-5xl">404</CardTitle>
          <CardDescription>This page does not exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/home">Back to home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
