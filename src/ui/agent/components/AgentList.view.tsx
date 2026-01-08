import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/ui/lib/components/ui/card.tsx";
import type {Agent} from "@/domain/agent/agent.type.ts";
import {Badge} from "@/ui/lib/components/ui/badge.tsx";
import {Loader} from "lucide-react";

interface AgentListViewProps {
    agents: Agent[];
    isLoading: boolean;
}

export function AgentListView(props: AgentListViewProps) {
    const { agents, isLoading } = props;

    return (
        <div className="space-y-3">
            {isLoading && <div className="w-full flex flex-row justify-center animate-spin"><Loader/></div>}
            {!isLoading && (agents.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/10">
                    No agents on the list.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {agents.map((agent) => (
                        <Card key={agent.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                                        <CardDescription>{agent.email}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="grow">
                                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </span>
                                    <div>
                                        <Badge variant="secondary">{agent.typeName}</Badge>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-4 border-t flex flex-wrap gap-2">
                                {agent.roles.includes("DataSupplier") && (
                                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                        Data Supplier
                                    </Badge>
                                )}
                                {agent.roles.includes("DataOwner") && (
                                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                                        Data Owner
                                    </Badge>
                                )}
                                {agent.roles.length == 0 && (
                                    <span className="text-xs text-muted-foreground">No roles</span>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ))}
        </div>
    );
}