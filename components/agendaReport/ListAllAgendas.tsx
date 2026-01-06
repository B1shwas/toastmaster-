import { useAgendaReport } from "@/lib/api/hooks/use-agenda-report";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";

export const ListAllAgendas = ({
    club_id,
    meeting_id,
}: {
    club_id?: string;
    meeting_id?: string;
}) => {
    const { data, isLoading, isError } = useAgendaReport();
    // console.log(meeting_id);
    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <p className="text-white text-lg">
                    Look like you dont have report attend meeting if you want to see
                    your report.
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-y-3 md:gap-y-6 my-4 md:my-8">
            <h1 className="text-white text-xl md:text-2xl font-bold">
                Your Reports
            </h1>
            <div className="flex flex-col text-white border border-neutral-700 rounded-xl p-4 md:p-8">
                <Accordion
                    type="single"
                    collapsible
                    className="flex flex-col gap-y-2 w-full"
                    defaultValue="item"
                >
                    {(() => {
                        const filteredData = (data ?? []).filter(
                            (d) =>
                                (!club_id || d?.club_id === club_id) &&
                                (!meeting_id || d?.meeting_id === meeting_id),
                        );

                        if (filteredData.length === 0) {
                            return (
                                <p className="flex w-full justify-center text-neutral-500">
                                    No items found.
                                </p>
                            );
                        }
                        return filteredData.map((d) => (
                            <div
                                className="flex flex-col bg-neutral-800 rounded-2xl px-4 pt-4"
                                key={d?.id}
                            >
                                <div className="flex flex-col gap-y-1 text-neutral-300 text-sm md:text-base">
                                    <p>
                                        <span className="font-bold text-white">
                                            Report Type:
                                        </span>{" "}
                                        {d?.report_type}
                                    </p>
                                    <p>
                                        <span className="font-bold text-white">
                                            Word of Day:
                                        </span>{" "}
                                        {d?.word_of_the_day}
                                    </p>
                                    <p>
                                        <span className="font-bold text-white">
                                            Overall Notes:
                                        </span>{" "}
                                        {d?.overall_notes}
                                    </p>
                                    <p>
                                        <span className="font-bold text-white">
                                            Word of Day Defination:
                                        </span>{" "}
                                        {d?.word_of_the_day_definition}
                                    </p>
                                    <p>
                                        <span className="font-bold text-white">
                                            Grammar Notes:
                                        </span>{" "}
                                        {d?.grammar_notes}
                                    </p>
                                </div>
                                <AccordionItem
                                    className="flex flex-col "
                                    value="item-1"
                                >
                                    <AccordionTrigger className=" flex gap-y-1 md:text-base">
                                        {d?.member_evaluation?.[0]
                                            ?.examples && (
                                            <p>Member Evaluations</p>
                                        )}
                                        {d?.filler_word_counts?.length > 0 && (
                                            <p>Filler Words</p>
                                        )}
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-y-1 md:gap-y-2 text-balance">
                                        {d?.member_evaluation
                                            ? d?.member_evaluation[0]?.examples?.map(
                                                  (i) => <p key={i}>{i}</p>,
                                              )
                                            : null}
                                        {d?.filler_word_counts
                                            ? d?.filler_word_counts?.map(
                                                  (i, index) => (
                                                      <div
                                                          key={index}
                                                          className="flex flex-col gap-y-1"
                                                      >
                                                          <p>
                                                              <span className="font-bold">
                                                                  Ahs:
                                                              </span>{" "}
                                                              {i.ahs}
                                                          </p>
                                                          <p>
                                                              <span className="font-bold">
                                                                  Ums:
                                                              </span>{" "}
                                                              {i.ums}
                                                          </p>
                                                          <p>
                                                              <span className="font-bold">
                                                                  Likes:
                                                              </span>{" "}
                                                              {i.likes}
                                                          </p>
                                                          <p>
                                                              <span className="font-bold">
                                                                  Other:
                                                              </span>{" "}
                                                              {i.other}
                                                          </p>
                                                          {i.notes && (
                                                              <p>
                                                                  <span className="font-bold">
                                                                      Notes:
                                                                  </span>{" "}
                                                                  {i.notes}
                                                              </p>
                                                          )}
                                                      </div>
                                                  ),
                                              )
                                            : null}
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        ));
                    })()}
                </Accordion>
            </div>
        </div>
    );
};
