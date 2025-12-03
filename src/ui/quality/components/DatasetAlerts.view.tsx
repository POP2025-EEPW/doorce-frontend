import React from "react";
import type { QualityValidityAlert } from "@/domain/quality/quality.type.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Badge } from "@/ui/lib/components/ui/badge";
import { Separator } from "@/ui/lib/components/ui/separator";
import { Switch } from "@/ui/lib/components/ui/switch";
import { Label } from "@/ui/lib/components/ui/label";
import { CheckCircle2, Clock, Database, Terminal } from "lucide-react";

type DatasetAlertsViewProps = {
  alerts: QualityValidityAlert[];
  unresolvedOnly: boolean;
  onUnresolvedOnlyChange: (unresolvedOnly: boolean) => void;
};

export default function DatasetAlertsView({
  alerts,
  unresolvedOnly,
  onUnresolvedOnlyChange,
}: DatasetAlertsViewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Quality & Validity Alerts
            </CardTitle>
            <CardDescription>
              Monitoring {alerts.length} issues across your datasets.
            </CardDescription>
          </div>

          {/* Switch Control */}
          <div className="flex items-center space-x-2">
            <Switch
              id="unresolved-mode"
              checked={unresolvedOnly}
              onCheckedChange={onUnresolvedOnlyChange}
            />
            <Label htmlFor="unresolved-mode">Unresolved only</Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No dataset alerts.
          </p>
        ) : (
          alerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              {/* Render separator between items */}
              {index > 0 && <Separator />}

              <div
                className={`flex flex-col gap-3 p-2 rounded-lg transition-colors ${alert.resolved ? "opacity-60 bg-muted/50" : ""}`}
              >
                {/* Row 1: Header - Severity and Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Severity as Text only */}
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {alert.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm font-semibold">
                      {alert.alertType}
                    </span>
                  </div>

                  {/* Resolved Status */}
                  {alert.resolved && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600 gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Resolved
                    </Badge>
                  )}
                </div>

                {/* Row 2: Main Content */}
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    {alert.datasetTitle}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>

                {/* Row 3: Footer - Date */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </CardContent>
    </Card>
  );
}
