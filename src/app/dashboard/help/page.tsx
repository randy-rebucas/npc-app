import Header from "@/components/header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getFaqs } from "@/app/actions/faq";


export default async function HelpPage() {
    const faqs = await getFaqs();
    console.log(faqs);
    return (
        <SidebarInset>
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                {
                    label: 'Help',
                    href: '/dashboard/help',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Help</h1>
                    </div>
                    <Tabs defaultValue="contact" className="max-w-2xl">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="contact">Contact Us</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                        </TabsList>
                        <TabsContent value="contact">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Us</CardTitle>
                                    <CardDescription>
                                        Need Help or Have Feedback?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex flex-col">
                                        <div className="w-full space-y-4">
                                            {/* Contact Us Card */}
                                            <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                <div>
                                                    <h2 className="text-lg font-medium">Contact us</h2>
                                                    <p className="text-gray-400 text-sm">Can ask us for any help</p>
                                                </div>
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-2xl">@</span>
                                                </div>
                                            </div>

                                            {/* Report Issue Card */}
                                            <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                <div>
                                                    <h2 className="text-lg font-medium">Report an issue</h2>
                                                    <p className="text-gray-400 text-sm">Let us know of any bug</p>
                                                </div>
                                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xl">🐞</span>
                                                </div>
                                            </div>

                                            {/* Request Feature Card */}
                                            <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                <div>
                                                    <h2 className="text-lg font-medium">Request a feature</h2>
                                                    <p className="text-gray-400 text-sm">Tell us about new features</p>
                                                </div>
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">NEW</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="faq">
                            <Card>
                                <CardHeader>
                                    <CardTitle>FAQ</CardTitle>
                                    <CardDescription>
                                        Frequently asked questions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {faqs.length > 0 ? (
                                        <Accordion type="single" collapsible>
                                            {faqs.map((faq) => (
                                                <AccordionItem value={faq.id} key={faq.id}>
                                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <div className="flex justify-center items-center h-full">
                                            <p className="text-gray-400 text-sm">No FAQs found</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>


                </div>
            </div>
        </SidebarInset>
    );
}