import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Hourglass  } from "lucide-react"; // Or any icon

export default function PendingApproval() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-amber-100 p-4 rounded-full w-fit mb-4">
            <Hourglass  className="text-amber-600 w-10 h-10" />
          </div>
          <CardTitle className="text-2xl">Approval Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Thank you for registering! Your account is currently being reviewed by an administrator. 
            You will gain access to the portal once your account is approved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}