import React, { useEffect } from "react";
import Navbar from "../components/Navbar/NavbarUpdated";
import FooterSection from "../components/home/FooterSectionUpdated";
import Breadcrumb from "../components/common/Breadcrumb";

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const SectionTitle = ({ children }) => (
        <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white uppercase tracking-wide">
            {children}
        </h2>
    );

    const SubTitle = ({ children }) => (
        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">
            {children}
        </h3>
    );

    const Paragraph = ({ children }) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {children}
        </p>
    );

    const List = ({ items }) => (
        <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </ul>
    );

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto w-full">
                <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Privacy Policy" }]} />
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center text-gray-900 dark:text-white uppercase tracking-widest">
                    Privacy Policy
                </h1>
                <p className="text-center text-gray-500 mb-12 italic font-medium">
                    Last Updated: 26/08/2026
                </p>

                <div className="text-base text-gray-700 dark:text-gray-300 space-y-6">
                    <Paragraph>
                        NARA ("NARA", "we", "our" or "us") is operated by <span className="font-bold">AAISHKA INDUSTRIES PRIVATE LIMITED</span>.
                    </Paragraph>
                    <Paragraph>
                        We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains what personal data we collect when you visit or use our website, purchase our products, communicate with us, participate in our promotions or otherwise interact with NARA, how we use that information, with whom we may share it, how long we retain it and the choices available to you.
                    </Paragraph>
                    <Paragraph>
                        This Privacy Policy is intended to be read in accordance with applicable Indian law, including the Information Technology Act, 2000 and applicable rules thereunder, and, as and when applicable, the Digital Personal Data Protection Act, 2023 ("DPDP Act") and rules made thereunder.
                    </Paragraph>
                    <Paragraph>
                        By using our website or providing your personal data to us, you acknowledge the practices described in this Privacy Policy. Where applicable law requires consent, we will seek such consent separately and in an appropriate manner.
                    </Paragraph>

                    <SectionTitle>1. WHO IS RESPONSIBLE FOR YOUR PERSONAL DATA?</SectionTitle>
                    <Paragraph>
                        For personal data processed through the NARA website and related services, NARA / AAISHKA INDUSTRIES PRIVATE LIMITED determines the purpose and manner in which such personal data is processed.
                    </Paragraph>
                    <Paragraph>
                        For purposes of the DPDP Act, where applicable, we act as the <span className="font-bold">Data Fiduciary</span> in relation to such personal data.
                    </Paragraph>

                    <SectionTitle>2. PERSONAL DATA WE MAY COLLECT</SectionTitle>
                    <Paragraph>Depending on how you interact with NARA, we may collect the following categories of personal data:</Paragraph>

                    <SubTitle>A. Identity and Contact Information</SubTitle>
                    <List items={["Name", "Email address", "Mobile number", "Billing address", "Shipping or delivery address"]} />

                    <SubTitle>B. Account Information</SubTitle>
                    <Paragraph>Where customer accounts are enabled, we may collect:</Paragraph>
                    <List items={["Login or account details", "Saved addresses", "Order history", "Account preferences"]} />

                    <SubTitle>C. Order and Transaction Information</SubTitle>
                    <Paragraph>We may collect:</Paragraph>
                    <List items={["Products purchased or returned", "Order value", "Discounts or store credits used", "Transaction status", "Refund and return information", "Payment method information"]} />
                    <Paragraph>
                        NARA generally does not directly store complete credit-card, debit-card, UPI PIN or other payment authentication credentials. Payments may be processed by authorised third-party payment service providers.
                    </Paragraph>

                    <SubTitle>D. Device and Technical Information</SubTitle>
                    <Paragraph>When you access our website, certain information may be collected automatically, including:</Paragraph>
                    <List items={["IP address", "Browser type", "Device type", "Operating system", "Referring URLs", "Website activity", "Pages viewed", "Date and time of visits", "Cookie or similar technology identifiers"]} />

                    <SubTitle>E. Marketing and Preference Information</SubTitle>
                    <Paragraph>This may include:</Paragraph>
                    <List items={["Marketing communication preferences", "Email or SMS subscription status", "Responses to campaigns or promotions", "Products viewed or added to cart", "Interactions with advertisements"]} />

                    <SubTitle>F. Communications</SubTitle>
                    <Paragraph>
                        If you contact us through email, WhatsApp, social media, customer support or another channel, we may retain information contained in those communications where necessary to respond to you or maintain records.
                    </Paragraph>

                    <SubTitle>G. Information You Voluntarily Provide</SubTitle>
                    <Paragraph>You may voluntarily provide information through:</Paragraph>
                    <List items={["Reviews", "Surveys", "Giveaways", "Contests", "Feedback forms", "Influencer or creator collaborations", "Customer service conversations"]} />
                    <Paragraph>We request that you do not provide personal data that is unnecessary for the relevant purpose.</Paragraph>

                    <SectionTitle>3. HOW WE COLLECT PERSONAL DATA</SectionTitle>
                    <Paragraph>We may collect personal data:</Paragraph>
                    <List items={[
                        "Directly from you when you purchase a product, create an account, subscribe, contact us or submit information;",
                        "Automatically when you interact with our website;",
                        "From payment, shipping, technology, analytics or advertising service providers;",
                        "From social-media platforms where you interact with NARA;",
                        "From other sources where permitted by applicable law."
                    ]} />

                    <SectionTitle>4. WHY WE USE YOUR PERSONAL DATA</SectionTitle>
                    <Paragraph>We process personal data only for specified and legitimate purposes. Depending on your interaction with NARA, these may include:</Paragraph>

                    <SubTitle>Processing and Delivering Orders</SubTitle>
                    <Paragraph>To:</Paragraph>
                    <List items={["Accept and process purchases;", "Confirm orders;", "Arrange payment;", "Pack and dispatch products;", "Send shipping and delivery updates;", "Process returns, exchanges and refunds."]} />

                    <SubTitle>Customer Support</SubTitle>
                    <Paragraph>To:</Paragraph>
                    <List items={["Respond to queries;", "Resolve complaints;", "Assist with orders, returns, exchanges or store credit;", "Communicate regarding customer-service matters."]} />

                    <SubTitle>Managing Customer Accounts</SubTitle>
                    <Paragraph>To:</Paragraph>
                    <List items={["Create and maintain customer accounts;", "Allow access to order history and account functionality;", "Maintain customer preferences."]} />

                    <SubTitle>Marketing and Promotional Communications</SubTitle>
                    <Paragraph>Where permitted by law and, where required, with your consent, we may use your contact information to send:</Paragraph>
                    <List items={["New collection announcements;", "Sale information;", "Promotional offers;", "Back-in-stock notifications;", "Brand updates;", "Other marketing communications."]} />
                    <Paragraph>You may opt out of promotional communications at any time using the unsubscribe mechanism provided or by contacting us.</Paragraph>

                    <SubTitle>Website Analytics and Improvement</SubTitle>
                    <Paragraph>We may analyse website activity to:</Paragraph>
                    <List items={["Understand how customers use our website;", "Improve website performance;", "Improve product discovery and navigation;", "Measure campaigns;", "Diagnose technical problems;", "Improve our products and customer experience."]} />

                    <SubTitle>Advertising</SubTitle>
                    <Paragraph>Subject to applicable consent requirements, we may use website activity and advertising technologies to:</Paragraph>
                    <List items={["Measure advertising effectiveness;", "Create audiences;", "Show relevant advertisements;", "Conduct retargeting campaigns on advertising platforms."]} />

                    <SubTitle>Fraud Prevention and Security</SubTitle>
                    <Paragraph>We may process information to:</Paragraph>
                    <List items={["Detect or prevent fraudulent transactions;", "Protect customer accounts;", "Protect our website and systems;", "Investigate suspicious activity."]} />

                    <SubTitle>Legal and Regulatory Compliance</SubTitle>
                    <Paragraph>We may process or retain personal data when required to:</Paragraph>
                    <List items={["Comply with tax, accounting and regulatory obligations;", "Respond to lawful governmental or judicial requests;", "Establish, exercise or defend legal claims;", "Comply with applicable law."]} />

                    <SectionTitle>5. CONSENT</SectionTitle>
                    <Paragraph>Where we rely on your consent to process personal data, we will seek consent in a manner that is clear, specific and appropriate to the relevant purpose.</Paragraph>
                    <Paragraph>Your consent will not be treated as permission for unrelated processing.</Paragraph>
                    <Paragraph>Where consent is the basis of processing, you may withdraw your consent at any time. Withdrawing consent will not affect processing already lawfully undertaken before withdrawal.</Paragraph>
                    <Paragraph>Withdrawal may mean that we are unable to continue providing a particular optional service that requires that personal data.</Paragraph>
                    <Paragraph>For example, withdrawing marketing consent will stop future promotional communications but will not prevent us from sending necessary transactional communications concerning an order you have placed.</Paragraph>

                    <SectionTitle>6. COOKIES AND SIMILAR TECHNOLOGIES</SectionTitle>
                    <Paragraph>Our website may use cookies, pixels, tags, local storage or similar technologies.</Paragraph>
                    <Paragraph>These technologies may be used for:</Paragraph>
                    <SubTitle>Essential Functions</SubTitle>
                    <Paragraph>For example:</Paragraph>
                    <List items={["Keeping items in your shopping cart;", "Processing checkout;", "Maintaining security;", "Remembering necessary website settings."]} />
                    <SubTitle>Analytics</SubTitle>
                    <Paragraph>To understand website usage and improve performance.</Paragraph>
                    <SubTitle>Advertising and Marketing</SubTitle>
                    <Paragraph>Subject to applicable consent requirements, technologies provided by advertising partners may be used to understand campaign performance and deliver relevant advertising.</Paragraph>
                    <Paragraph>Where required by applicable law, we will obtain your consent before placing or accessing non-essential cookies or similar technologies.</Paragraph>
                    <Paragraph>You may also control certain cookies through your browser settings. Disabling some cookies may affect website functionality.</Paragraph>

                    <SectionTitle>7. WHO WE MAY SHARE PERSONAL DATA WITH</SectionTitle>
                    <Paragraph>We do not sell your personal data.</Paragraph>
                    <Paragraph>We may disclose personal data to service providers where reasonably necessary to operate NARA, including:</Paragraph>
                    <List items={["E-commerce and website hosting providers;", "Payment gateways and payment processors;", "Courier, logistics and fulfilment providers;", "Customer-support providers;", "Email, SMS or WhatsApp communication providers;", "Cloud-hosting and technology providers;", "Analytics providers;", "Advertising and social-media platforms;", "Accounting, tax and professional advisers;", "Fraud-prevention or security providers."]} />
                    <Paragraph>These parties may process personal data only as necessary to provide their services or as otherwise permitted by applicable law.</Paragraph>
                    <Paragraph>We may also disclose information:</Paragraph>
                    <List items={["Where required by law;", "Pursuant to a lawful order or regulatory requirement;", "To protect our legal rights;", "To prevent fraud or security threats;", "In connection with a merger, restructuring, acquisition, sale or transfer of all or part of our business, subject to applicable law."]} />

                    <SectionTitle>8. SHOPIFY AND THIRD-PARTY SERVICES</SectionTitle>
                    <Paragraph>Our online store may be hosted using Shopify or other e-commerce technology providers.</Paragraph>
                    <Paragraph>Such service providers may process certain personal data on our behalf or in connection with providing their services.</Paragraph>
                    <Paragraph>Third-party payment gateways, logistics providers, advertising services and other service providers may maintain their own privacy policies and may process personal data according to those policies and applicable law.</Paragraph>
                    <Paragraph>We encourage you to review the privacy policies of services through which you interact with NARA.</Paragraph>

                    <SectionTitle>9. INTERNATIONAL PROCESSING AND TRANSFERS</SectionTitle>
                    <Paragraph>Some of our technology, cloud, analytics, payment, advertising or other service providers may process or store information outside India.</Paragraph>
                    <Paragraph>Where personal data is transferred outside India, we will do so subject to applicable Indian law and any restrictions or requirements notified by the Government of India from time to time.</Paragraph>

                    <SectionTitle>10. HOW LONG WE RETAIN PERSONAL DATA</SectionTitle>
                    <Paragraph>We do not intend to retain personal data indefinitely.</Paragraph>
                    <Paragraph>We may retain personal data for as long as reasonably necessary for:</Paragraph>
                    <List items={["Completing transactions;", "Maintaining customer accounts;", "Processing returns, refunds or store credits;", "Customer support;", "Accounting and taxation;", "Fraud prevention;", "Resolving disputes;", "Establishing or defending legal claims;", "Meeting statutory or regulatory retention requirements."]} />
                    <Paragraph>Where personal data is no longer required for its intended purpose and there is no legal requirement to retain it, we will take reasonable steps to erase or anonymise it.</Paragraph>

                    <SectionTitle>11. SECURITY OF PERSONAL DATA</SectionTitle>
                    <Paragraph>We use reasonable technical, organisational and administrative safeguards designed to protect personal data against:</Paragraph>
                    <List items={["Unauthorised access;", "Unauthorised disclosure;", "Loss;", "Misuse;", "Alteration;", "Destruction."]} />
                    <Paragraph>Access to personal data should be restricted to personnel and service providers who require access for legitimate business purposes.</Paragraph>
                    <Paragraph>However, no internet transmission or electronic storage system can be guaranteed to be completely secure.</Paragraph>
                    <Paragraph>If we become aware of a personal-data breach, we will take steps required under applicable law, which may include investigating the incident, mitigating harm and notifying affected individuals and/or the relevant authority where required.</Paragraph>

                    <SectionTitle>12. YOUR RIGHTS</SectionTitle>
                    <Paragraph>Subject to applicable law and the relevant provisions being in force, you may have rights concerning your personal data, including the right to:</Paragraph>
                    <SubTitle>Access</SubTitle>
                    <Paragraph>Request information about personal data we process about you.</Paragraph>
                    <SubTitle>Correction and Updating</SubTitle>
                    <Paragraph>Ask us to correct inaccurate or incomplete personal data.</Paragraph>
                    <SubTitle>Erasure</SubTitle>
                    <Paragraph>Request erasure of personal data where retention is no longer necessary or otherwise where permitted by law.</Paragraph>
                    <SubTitle>Withdrawal of Consent</SubTitle>
                    <Paragraph>Withdraw consent where consent is the basis on which we process your personal data.</Paragraph>
                    <SubTitle>Grievance Redressal</SubTitle>
                    <Paragraph>Raise a complaint or grievance concerning our processing of your personal data.</Paragraph>
                    <SubTitle>Nomination</SubTitle>
                    <Paragraph>Where applicable under the DPDP Act, nominate another individual to exercise your rights in circumstances permitted by law.</Paragraph>
                    <Paragraph>Certain requests may be subject to identity verification and legal exceptions.</Paragraph>
                    <Paragraph>To exercise your rights, contact us using the details specified under <span className="font-bold">Contact and Grievance Redressal</span> below.</Paragraph>

                    <SectionTitle>13. MARKETING PREFERENCES</SectionTitle>
                    <Paragraph>You can stop receiving promotional communications from us at any time.</Paragraph>
                    <Paragraph>Depending on the communication channel, you may:</Paragraph>
                    <List items={["Select the unsubscribe link in an email;", "Use an opt-out mechanism included in an SMS or WhatsApp communication where available; or", "Contact us at info@narawear.com."]} />
                    <Paragraph>Even if you opt out of marketing communications, we may continue sending transactional or service-related communications necessary to fulfil your orders or respond to your requests.</Paragraph>

                    <SectionTitle>14. CHILDREN'S PERSONAL DATA</SectionTitle>
                    <Paragraph>NARA's products and website are intended primarily for adults.</Paragraph>
                    <Paragraph>We do not knowingly seek to collect personal data from children for purposes requiring parental consent.</Paragraph>
                    <Paragraph>Where processing of a child's personal data is subject to requirements under the DPDP Act or other applicable law, we will take appropriate steps to obtain verifiable consent from the child's parent or lawful guardian where required.</Paragraph>
                    <Paragraph>If you believe a child has provided personal data to us contrary to applicable requirements, please contact us.</Paragraph>

                    <SectionTitle>15. THIRD-PARTY LINKS</SectionTitle>
                    <Paragraph>Our website or communications may contain links to third-party websites, social-media services or platforms.</Paragraph>
                    <Paragraph>NARA does not control the privacy practices of those third parties. Their collection and processing of personal data will be governed by their own terms and privacy policies.</Paragraph>

                    <SectionTitle>16. YOUR RESPONSIBILITIES</SectionTitle>
                    <Paragraph>When providing personal data to NARA, please ensure that the information is accurate and up to date.</Paragraph>
                    <Paragraph>If you provide personal data relating to another individual, you should ensure that you are authorised to provide that information and that doing so is lawful.</Paragraph>

                    <SectionTitle>17. CHANGES TO THIS PRIVACY POLICY</SectionTitle>
                    <Paragraph>We may update this Privacy Policy periodically to reflect:</Paragraph>
                    <List items={["Changes in law;", "Changes to our business;", "New technologies;", "New services;", "Changes in how personal data is processed."]} />
                    <Paragraph>The updated version will be published on this page with a revised <span className="font-bold">Last Updated</span> date.</Paragraph>
                    <Paragraph>Where a material change requires fresh consent under applicable law, we will obtain such consent before undertaking the relevant processing.</Paragraph>

                    <SectionTitle>18. CONTACT AND GRIEVANCE REDRESSAL</SectionTitle>
                    <Paragraph>If you have questions about this Privacy Policy, wish to exercise your privacy rights or would like to raise a grievance regarding your personal data, please contact:</Paragraph>
                    <Paragraph>
                        <span className="font-bold block">NARA / AAISHKA INDUSTRIES PRIVATE LIMITED</span>
                        <span className="block">Privacy / Grievance Contact: Grievance Officer</span>
                        <span className="block">Email: info@narawear.com</span>
                        <span className="block">Postal Address: S-07-3, PI No 88-91, Haware Centurion Mall, Navi Mumbai, 400706</span>
                        <span className="block">Telephone: +91 9326472754</span>
                    </Paragraph>
                    <Paragraph>Please include sufficient information for us to identify your request while avoiding unnecessary disclosure of sensitive information.</Paragraph>
                    <Paragraph>We will review and respond to privacy grievances within the period required under applicable law.</Paragraph>

                    <SectionTitle>19. GOVERNING LAW</SectionTitle>
                    <Paragraph>This Privacy Policy shall be governed by the laws of India.</Paragraph>
                    <Paragraph>Nothing in this Privacy Policy is intended to limit any rights available to an individual under applicable data-protection or consumer-protection law.</Paragraph>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default PrivacyPolicy;
