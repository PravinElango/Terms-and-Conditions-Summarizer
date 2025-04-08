from summarizer import summarize_text
from llm_processor import generate_keypoints_and_breakdown

input_text = """Terms and Conditions for StreamFlix
Last Updated: March 22, 2025

Welcome to StreamFlix. Please read these Terms and Conditions ("Terms") carefully before using our streaming service.

1. Acceptance of Terms
By creating a StreamFlix account or using any StreamFlix service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.

2. Subscription and Billing
2.1 Subscription Plans
StreamFlix offers various subscription plans. Details of each plan are available on our website.

2.2 Billing Cycle
Your subscription will automatically renew at the end of each billing cycle unless you cancel prior to the renewal date. Billing cycles are monthly or annually, depending on your chosen plan.

2.3 Price Changes
We reserve the right to adjust our pricing. Any price changes will be communicated to you at least 30 days before taking effect.

2.4 Payment Methods
You must provide a current, valid, and accepted method of payment. You are responsible for keeping your payment information up-to-date.

2.5 No Refunds
Payments are non-refundable and there are no refunds or credits for partially used periods.

3. Account Usage
3.1 Age Restrictions
You must be at least 18 years of age to create a StreamFlix account.

3.2 Account Sharing
Your StreamFlix account is for personal use only and is limited to a single household. Sharing your account outside your household is prohibited.

3.3 Account Security
You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify StreamFlix immediately of any unauthorized use of your account.

4. Content and Intellectual Property
4.1 Content Availability
Content available on StreamFlix may vary by geographic location and can change at any time without notice.

4.2 Viewing Rights
StreamFlix grants you a limited, non-exclusive, non-transferable right to access and view StreamFlix content for personal, non-commercial purposes.

4.3 Restrictions
You agree not to:

Archive, download (except through our official download feature), reproduce, distribute, modify, display, perform, publish, license, create derivative works from, or offer for sale any content from StreamFlix
Circumvent, remove, alter, deactivate, degrade, or thwart any content protections
Use any robot, spider, scraper, or other automated means to access StreamFlix
Decompile, reverse engineer, or disassemble any software or other products or processes accessible through StreamFlix
5. Privacy and Data Collection
5.1 Personal Information
StreamFlix collects and processes personal information as described in our Privacy Policy.

5.2 Viewing Data
We collect information about what you watch, search for, and how you interact with our service to provide personalized recommendations and improve our service.

5.3 Device Information
We collect information about devices used to access StreamFlix, including device types, operating systems, and unique device identifiers.

5.4 Location Data
We may collect approximate location information to provide localized content and comply with geographic restrictions.

6. Termination
6.1 Cancellation
You may cancel your subscription at any time. Follow the cancellation instructions on our website or contact customer service.

6.2 Termination by StreamFlix
StreamFlix reserves the right to terminate or restrict your use of our service without notice if:

You violate these Terms
You engage in illegal or fraudulent activity
You provide false information
You engage in conduct that is harmful to other users, third parties, or StreamFlix's business interests
7. Disclaimers and Limitations of Liability
7.1 Service "As Is"
The StreamFlix service is provided "as is" and without warranty of any kind.

7.2 Limitation of Liability
To the maximum extent permitted by applicable law, StreamFlix shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

7.3 Maximum Liability
In no event shall StreamFlix's total liability to you for all damages exceed the amount paid by you to StreamFlix during the 12 months preceding the claim.

8. Dispute Resolution
8.1 Arbitration Agreement
You and StreamFlix agree that any dispute, claim, or controversy arising out of or relating to these Terms shall be settled by binding arbitration.

8.2 Class Action Waiver
You agree to resolve disputes with StreamFlix on an individual basis and waive any right to participate in a class action lawsuit.

8.3 Governing Law
These Terms are governed by the laws of the State of California without regard to its conflict of law principles.

9. Changes to Terms
StreamFlix may, from time to time, change these Terms. We will notify you at least 30 days before any material changes take effect.

10. Contact Information
If you have any questions about these Terms, please contact us at:

Email: support@streamflix.example.com
Address: 123 Streaming Avenue, Entertainment City, CA 90210
Phone: 1-800-STREAM-NOW
"""  # your terms and conditions

# Summary
summary = summarize_text(input_text)
print("🔹 Summary:\n", summary)

# Key Points and Breakdown
keypoints, detailed = generate_keypoints_and_breakdown(input_text)
print("\n🔸 Key Points:\n", keypoints)
print("\n🔸 Detailed Breakdown:\n", detailed)
