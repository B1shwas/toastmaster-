import { PlusIcon, TrashIcon } from "lucide-react";
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
    AgendaReport,
    AgendaReportPayload,
    CAN_CREATE,
    MemberReportData,
    REPORT_TYPE,
} from "@/lib/types/agendaReport";
import { useCreateReport } from "@/lib/api/hooks/use-agenda-report";
import { useParams } from "next/navigation";

export const CreateAgendaReport = ({
    canUserCreateIt,
    onEditSuccess,
}: {
    canUserCreateIt: CAN_CREATE;
    onEditSuccess?: () => void;
}) => {
    const { data } = useProfile();
    const initializeMemberReports = (
        report: AgendaReport | null | undefined,
    ): MemberReportData[] => {
        if (!report) return [];

        if (report?.reportType === "GRAMMARIAN" && report?.memberEvaluations) {
            return report?.memberEvaluations?.map((evaluation) => ({
                memberId: evaluation?.memberId,
                memberName: evaluation?.memberName,
                wordUsageCount: evaluation?.wordUsageCount,
                examples: evaluation?.examples,
                grammarIssues: evaluation?.grammarIssues,
                role: evaluation?.role,
            }));
        }

        if (report.reportType === "AH_COUNTER" && report?.fillerWordCounts) {
            return report?.fillerWordCounts?.map((count) => ({
                memberId: count?.memberId,
                memberName: count?.memberName,
                ahs: count?.ahs,
                ums: count?.ums,
                likes: count?.likes,
                other: count?.other,
                notes: count?.notes,
                role: count?.role,
            }));
        }

        return [];
    };

    const initialValues = {
        wordOfTheDay: canUserCreateIt?.report?.wordOfTheDay || "",
        wordOfTheDayDefinition:
            canUserCreateIt?.report?.wordOfTheDayDefinition || "",
        grammarNotes: canUserCreateIt?.report?.grammarNotes || "",
        overallNotes: canUserCreateIt?.report?.overallNotes || "",
        memberReports: initializeMemberReports(canUserCreateIt?.report),
    };

    const [wordOfTheDay, setWordOfTheDay] = useState(
        canUserCreateIt?.report?.wordOfTheDay || "",
    );
    const [wordOfTheDayDefinition, setWordOfTheDayDefinition] = useState(
        canUserCreateIt?.report?.wordOfTheDayDefinition || "",
    );
    const [grammarNotes, setGrammarNotes] = useState(
        canUserCreateIt?.report?.grammarNotes || "",
    );
    const [overallNotes, setOverallNotes] = useState(
        canUserCreateIt?.report?.overallNotes || "",
    );

    const [memberReports, setMemberReports] = useState<MemberReportData[]>(
        initializeMemberReports(canUserCreateIt?.report),
    );
    // console.log("member reports :: ", memberReports);

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
            reportType: canUserCreateIt?.roleName
                .toUpperCase()
                .split(" ")
                .join("_") as REPORT_TYPE,
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

        console.log("Final Payload:", payload);
        console.log(memberReports);
        createReport.mutate(payload, {
            onSuccess: () => {
                // setWordOfTheDay("");
                // setWordOfTheDayDefinition("");
                // setGrammarNotes("");
                // setOverallNotes("");
                // setMemberReports([]);
                onEditSuccess?.();
            },
        });
    };

    const memberToDisplay = canUserCreateIt?.meeting
        ? canUserCreateIt?.meeting
        : memberReports;

    const hasChanges = () => {
        if (wordOfTheDay !== initialValues.wordOfTheDay) return true;
        if (wordOfTheDayDefinition !== initialValues.wordOfTheDayDefinition)
            return true;
        if (grammarNotes !== initialValues.grammarNotes) return true;
        if (overallNotes !== initialValues.overallNotes) return true;
        if (
            JSON.stringify(memberReports) !==
            JSON.stringify(initialValues.memberReports)
        )
            return true;

        return false;
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
                {memberToDisplay
                    ?.filter((m) => m?.memberId !== data?.user_id)
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
                                    {canUserCreateIt?.meeting !== null &&
                                        hasReport && (
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
                    canUserCreateIt?.meeting !== null
                        ? memberReports.length !==
                          canUserCreateIt?.meeting?.filter(
                              (m) => m.userId !== data?.user_id,
                          ).length
                        : !hasChanges()
                }
                className="w-full bg-black hover:bg-neutral-800 disabled:bg-blue-950 cursor-pointer disabled:cursor-not-allowed"
            >
                {`${canUserCreateIt?.meeting !== null ? `Submit Report` : "Edit Report"}`}{" "}
                {canUserCreateIt?.meeting !== null &&
                    `(${memberReports.length}/
                ${
                    canUserCreateIt?.meeting?.filter(
                        (m) => m.userId !== data?.user_id,
                    )?.length
                }${" "}
                completed)`}
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
    member: MemberReportData;
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

    const [examples, setExamples] = useState<string[]>(
        existingData?.examples || [],
    );
    console.log("examples :: ", examples);
    const [currentInput, setCurrentInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, examples: examples });
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
                                                    wordUsageCount: Math.max(
                                                        0,
                                                        Number(
                                                            e.target.value,
                                                        ) || 0,
                                                    ),
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="examples">
                                            Examples
                                        </FieldLabel>
                                        <div className="flex w-full items-center gap-2 justify-between">
                                            <Textarea
                                                id="examples"
                                                value={currentInput}
                                                onChange={(e) =>
                                                    setCurrentInput(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Example 1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (currentInput.trim()) {
                                                        setExamples((prev) => [
                                                            ...prev,
                                                            currentInput.trim(),
                                                        ]);
                                                        setCurrentInput("");
                                                    }
                                                }}
                                                className="bg-white border hover:bg-neutral-300"
                                            >
                                                <PlusIcon className="text-black" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-col bg-neutral-300 rounded">
                                            {examples.length > 0 ? (
                                                examples?.map((ex, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center border border-neutral-400 rounded px-4 py-2 m-2"
                                                    >
                                                        <p>{ex}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setExamples(
                                                                    (prev) =>
                                                                        prev?.filter(
                                                                            (
                                                                                _,
                                                                                i,
                                                                            ) =>
                                                                                i !=
                                                                                index,
                                                                        ),
                                                                );
                                                            }}
                                                        >
                                                            <TrashIcon className="text-red-800 hover:text-red-400 cursor-pointer" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex  border border-neutral-400 rounded px-4 m-2">
                                                    <p>
                                                        Enter example and click
                                                        &apos;+&apos; button
                                                    </p>
                                                </div>
                                            )}
                                        </div>
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
                                                    ahs: Math.max(
                                                        0,
                                                        Number(
                                                            e.target.value,
                                                        ) || 0,
                                                    ),
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
                                                    ums: Math.max(
                                                        0,
                                                        Number(
                                                            e.target.value,
                                                        ) || 0,
                                                    ),
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
                                                    likes: Math.max(
                                                        0,
                                                        Number(
                                                            e.target.value,
                                                        ) || 0,
                                                    ),
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
                                                    other: Math.max(
                                                        0,
                                                        Number(
                                                            e.target.value,
                                                        ) || 0,
                                                    ),
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
