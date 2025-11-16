import React from 'react';

// Component for a policy section to keep the main component clean
const PolicySection = ({ title, children }) => (
    <section>
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-indigo-400 border-b-2 border-gray-200 dark:border-b-indigo-500/30 pb-2">
            {title}
        </h2>
        <div className="mt-4 space-y-4 text-base md:text-lg leading-relaxed">
            {children}
        </div>
    </section>
);

// Component for list items for consistent styling
const PolicyListItem = ({ children }) => (
    <li className="pl-2">{children}</li>
);

const PrivacyPolicyPage = () => {
    const lastUpdatedDate = "October 26, 2023";

    return (
        <main className="bg-white dark:bg-black text-gray-700 dark:text-gray-300">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Privacy Policy</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">For HF Universe</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: {lastUpdatedDate}</p>
                </div>

                <div className="space-y-8">
                    <p className="text-lg leading-relaxed">
                        Welcome to HF Universe! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>
                    <PolicySection title="1. Information We Collect">
                        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                        <ul className="list-disc list-inside space-y-3">
                            <PolicyListItem>
                                <strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the Site using Firebase Authentication.
                            </PolicyListItem>
                            <PolicyListItem>
                                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, and access times.
                            </PolicyListItem>
                            <PolicyListItem>
                                <strong>User Preferences:</strong> We store preferences such as your selected streaming provider (`providerId` and `providerName`) in your browser's local storage to enhance your user experience.
                            </PolicyListItem>
                        </ul>
                    </PolicySection>

                    <PolicySection title="2. How We Use Your Information">
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                        <ul className="list-disc list-inside space-y-3">
                            <PolicyListItem>Create and manage your account.</PolicyListItem>
                            <PolicyListItem>Personalize your experience on the site.</PolicyListItem>
                            <PolicyListItem>Monitor and analyze usage and trends to improve your experience with the Site.</PolicyListItem>
                        </ul>
                    </PolicySection>

                    <PolicySection title="3. Disclosure of Your Information">
                        <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>
                    </PolicySection>

                    <PolicySection title="4. Security of Your Information">
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                    </PolicySection>

                    <PolicySection title="5. Changes to This Privacy Policy">
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </PolicySection>

                    <PolicySection title="6. Contact Us">
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:contact@hfuniverse.com" className="text-indigo-500 dark:text-indigo-400 hover:underline">contact@hfuniverse.com</a>
                        </p>
                    </PolicySection>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicyPage;