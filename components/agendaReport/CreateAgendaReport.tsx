import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { useProfile } from "@/lib/api";
import { Textarea } from "../ui/textarea";
import {
    AgendaReportPayload,
    CAN_CREATE,
    MemberReportData,
    REPORT_TYPE,
    USERS_IN_MEETING,
} from "@/lib/types/agendaReport";
import { useCreateReport } from "@/lib/api/hooks/use-agenda-report";
import { useParams } from "next/navigation";

export const CreateAgendaReport = ({
    canUserCreateIt,
}: {
    canUserCreateIt: CAN_CREATE;
}) => {
    const { data } = useProfile();
    const [wordOfTheDay, setWordOfTheDay] = useState("");
    const [wordOfTheDayDefinition, setWordOfTheDayDefinition] = useState("");
    const [grammarNotes, setGrammarNotes] = useState("");
    const [overallNotes, setOverallNotes] = useState("");

    const [memberReports, setMemberReports] = useState<MemberReportData[]>([]);

    const { meetingId } = useParams<{ meetingId: string }>();
        const createReport = useCreateReport(meetingId!);

    const handleMemberReportSubmit = (data: MemberReportData) => {
        setMemberReports((prev) => {
            const existingIndex = prev.findIndex(
                (r) => r.memberId === data.memberId,
            );
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = data;
                return updated;
            }
            return [...prev, data];
        });
    };

    const handleFinalSubmit = () => {
        const payload: AgendaReportPayload = {
            reportType: canUserCreateIt?.roleName as REPORT_TYPE,
            wordOfTheDay,
            wordOfTheDayDefinition,
            grammarNotes,
            overallNotes,
            memberEvaluations:
                canUserCreateIt?.roleName === REPORT_TYPE.GRAMMARIAN
                    ? memberReports.map((m) => ({
                          memberId: m.memberId,
                          memberName: m.memberName,
                          wordUsageCount: m.wordUsageCount || 0,
                          examples: m.examples || [],
                          grammarIssues: m.grammarIssues || "",
                      }))
                    : [],
            fillerWordCounts:
                canUserCreateIt?.roleName === REPORT_TYPE.AH_COUNTER
                    ? memberReports.map((m) => ({
                          memberId: m.memberId,
                          memberName: m.memberName,
                          ahs: m.ahs || 0,
                          ums: m.ums || 0,
                          likes: m.likes || 0,
                          other: m.other || 0,
                          notes: m.notes || "",
                      }))
                    : [],
        };

        // console.log("Final Payload:", payload);
        createReport.mutate(payload)
    };

    return (
        <div className="flex flex-col gap-y-4 text-white">
            <h1 className="text-2xl font-extrabold">
                Create {canUserCreateIt?.roleName} Report
            </h1>

            <div className="flex flex-col gap-y-2 border border-stone-600 rounded-xl p-4">
                <h2 className="text-xl font-bold">Report Details</h2>

                <div className="flex flex-col gap-y-2">
                    <label className="text-sm font-semibold">
                        Word of the Day
                    </label>
                    <Input
                        value={wordOfTheDay}
                        onChange={(e) => setWordOfTheDay(e.target.value)}
                        placeholder="Enter word of the day"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="text-sm font-semibold">
                        Word Definition
                    </label>
                    <Textarea
                        value={wordOfTheDayDefinition}
                        onChange={(e) =>
                            setWordOfTheDayDefinition(e.target.value)
                        }
                        placeholder="Enter definition"
                    />
                </div>

                {canUserCreateIt?.roleName === "Grammarian" && (
                    <div className="flex flex-col gap-y-2">
                        <label className="text-sm font-semibold">
                            Grammar Notes
                        </label>
                        <Textarea
                            value={grammarNotes}
                            onChange={(e) => setGrammarNotes(e.target.value)}
                            placeholder="General grammar observations"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-y-2">
                    <label className="text-sm font-semibold">
                        Overall Notes
                    </label>
                    <Textarea
                        value={overallNotes}
                        onChange={(e) => setOverallNotes(e.target.value)}
                        placeholder="Overall observations"
                    />
                </div>
            </div>

            {/* Member-specific Evaluations */}
            <div className="flex flex-col gap-y-2 border border-stone-600 rounded-xl p-2">
                <h2 className="text-xl font-bold p-2">Member Evaluations</h2>
                {canUserCreateIt?.meeting
                    .filter((m) => m.userId !== data?.user_id)
                    .map((member) => {
                        const hasReport = memberReports.find(
                            (r) => r.memberId === member.memberId,
                        );

                        return (
                            <div
                                key={member.memberId}
                                className="flex justify-between items-center border border-stone-400 p-2 md:p-4 rounded-xl"
                            >
                                <div>
                                    <p className="text-neutral-500">
                                        <span className="font-bold text-white">
                                            Name:
                                        </span>{" "}
                                        {member.memberName}
                                    </p>
                                    <p className="text-neutral-500">
                                        <span className="font-bold text-white">
                                            Role:
                                        </span>{" "}
                                        {member.role}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {hasReport && (
                                        <span className="text-green-500 font-bold">
                                            ✓
                                        </span>
                                    )}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <PlusIcon
                                                    size={24}
                                                    className="text-black"
                                                />
                                            </Button>
                                        </DialogTrigger>
                                        <MemberReportForm
                                            member={member}
                                            reportType={
                                                canUserCreateIt?.roleName as REPORT_TYPE
                                            }
                                            onSubmit={handleMemberReportSubmit}
                                            existingData={hasReport}
                                        />
                                    </Dialog>
                                </div>
                            </div>
                        );
                    })}
            </div>

            <Button
                onClick={handleFinalSubmit}
                disabled={
                    memberReports.length !==
                    canUserCreateIt?.meeting.filter(
                        (m) => m.userId !== data?.user_id,
                    ).length
                }
                className="w-full"
            >
                Submit Report ({memberReports.length}/
                {
                    canUserCreateIt?.meeting.filter(
                        (m) => m.userId !== data?.user_id,
                    ).length
                }{" "}
                completed)
            </Button>
        </div>
    );
};

const MemberReportForm = ({
    member,
    reportType,
    onSubmit,
    existingData,
}: {
    member: USERS_IN_MEETING;
    reportType: REPORT_TYPE;
    onSubmit: (data: MemberReportData) => void;
    existingData?: MemberReportData;
}) => {
    const [formData, setFormData] = useState<MemberReportData>({
        memberId: member.memberId,
        memberName: member.memberName,
        wordUsageCount: existingData?.wordUsageCount || 0,
        examples: existingData?.examples || [],
        grammarIssues: existingData?.grammarIssues || "",
        ahs: existingData?.ahs || 0,
        ums: existingData?.ums || 0,
        likes: existingData?.likes || 0,
        other: existingData?.other || 0,
        notes: existingData?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isGrammarian = reportType === REPORT_TYPE?.GRAMMARIAN;
    const isAhCounter = reportType === REPORT_TYPE?.AH_COUNTER;
    // console.log(reportType)
    // console.log(REPORT_TYPE.AH_COUNTER)
    return (
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <ScrollArea className="h-[60vh] w-full">
                    <FieldSet>
                        <FieldLegend>
                            {reportType} Report for {member.memberName}
                        </FieldLegend>
                        <FieldGroup>
                            {/* GRAMMARIAN Fields */}
                            {isGrammarian && (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="word-usage-count">
                                            Word Usage Count
                                        </FieldLabel>
                                        <Input
                                            id="word-usage-count"
                                            type="number"
                                            value={formData.wordUsageCount}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    wordUsageCount:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="examples">
                                            Examples (comma-separated)
                                        </FieldLabel>
                                        <Input
                                            id="examples"
                                            value={
                                                formData.examples?.join(", ") ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    examples: e.target.value
                                                        .split(",")
                                                        .map((s) => s.trim())
                                                        .filter(Boolean),
                                                }))
                                            }
                                            placeholder="Example 1, Example 2"
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="grammar-issues">
                                            Grammar Issues
                                        </FieldLabel>
                                        <Textarea
                                            id="grammar-issues"
                                            value={formData.grammarIssues}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    grammarIssues:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </Field>
                                </>
                            )}

                            {/* AH_COUNTER Fields */}
                            {isAhCounter && (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="ahs">
                                            Ahs Count
                                        </FieldLabel>
                                        <Input
                                            id="ahs"
                                            type="number"
                                            value={formData.ahs}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ahs:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="ums">
                                            Ums Count
                                        </FieldLabel>
                                        <Input
                                            id="ums"
                                            type="number"
                                            value={formData.ums}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ums:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="likes">
                                            Likes Count
                                        </FieldLabel>
                                        <Input
                                            id="likes"
                                            type="number"
                                            value={formData.likes}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    likes:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="other">
                                            Other Count
                                        </FieldLabel>
                                        <Input
                                            id="other"
                                            type="number"
                                            value={formData.other}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    other:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="notes">
                                            Notes
                                        </FieldLabel>
                                        <Textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    notes: e.target.value,
                                                }))
                                            }
                                        />
                                    </Field>
                                </>
                            )}
                        </FieldGroup>
                    </FieldSet>
                </ScrollArea>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit">Save Evaluation</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};
