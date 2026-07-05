import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  checkoutUrl?: string
  sequenceNumber?: 1 | 2 | 3 | 4
}

const DEFAULTS = {
  checkoutUrl: 'https://www.zeroappleaday.site/order',
}

type Copy = {
  headline: string
  preview: string
  paragraphs: string[]
  bullets?: string[]
  closingParagraphs?: string[]
  cta: string
  signOff: string
}

const COPY: Record<1 | 2 | 3 | 4, Copy> = {
  1: {
    headline: 'You Were Just One Step Away',
    preview: 'Your Clinic Growth Masterclass registration is still open',
    paragraphs: [
      'You were just one step away from registering for the Clinic Growth Masterclass… but your registration was not completed.',
      'Maybe you got busy. Maybe you had a question. Or maybe you are still thinking:',
      '“Is 999 PKR really worth it?”',
      'But Doctor, the real question is:',
      'Can you afford to keep depending only on referrals and random walk-ins for your clinic growth?',
      'Inside this masterclass, you will learn how to attract more local patients using Meta Ads, Google Business Profile, content, and WhatsApp follow-up.',
      'Your registration is still open for now.',
    ],
    cta: 'Complete My Registration',
    signOff: 'Regards,\nTeam Farhan Ali',
  },
  2: {
    headline: 'A Respectful But Honest Question',
    preview: 'Can you not invest even 999 PKR in your clinic’s growth?',
    paragraphs: [
      'A respectful but honest question, Doctor:',
      'You want more patients for your clinic… but can you not invest even 999 PKR to learn a proper patient acquisition system?',
      'Most practitioners spend years hoping that referrals, random Facebook posts, or occasional boosted ads will somehow bring consistent patients.',
      'But hope is not a growth strategy.',
      'The Clinic Growth Masterclass will show you a simple system to:',
    ],
    bullets: [
      'Create an offer patients actually respond to',
      'Build trust through content and personal branding',
      'Get local patient inquiries through Meta Ads',
      'Turn inquiries into bookings through WhatsApp',
    ],
    closingParagraphs: [
      'One patient appointment can easily recover your 999 PKR investment.',
    ],
    cta: 'Register Now',
    signOff: 'Regards,\nTeam Farhan Ali',
  },
  3: {
    headline: 'Let’s Look At This Practically',
    preview: 'One new patient recovers your 999 PKR — many times over',
    paragraphs: [
      'Your registration is still incomplete.',
      'Let’s look at this practically.',
      'The Clinic Growth Masterclass costs only 999 PKR.',
      'For most doctors, dentists, nutritionists, physiotherapists, and healthcare practitioners, even one new patient can recover that amount.',
      'And what happens when you learn how to consistently generate inquiries instead of waiting for patients to find you?',
      'That is exactly what this masterclass is designed to help you understand.',
      'You will not just learn “how to run ads.” You will learn how to build a complete patient journey:',
      'Offer → Ad/Content → WhatsApp Inquiry → Appointment',
    ],
    cta: 'Complete My Registration',
    signOff: 'Regards,\nTeam Farhan Ali',
  },
  4: {
    headline: 'Final Reminder ⏰',
    preview: 'Last reminder — registrations closing soon',
    paragraphs: [
      'This is the last reminder regarding your incomplete registration for the Clinic Growth Masterclass.',
      'We are closing registrations soon so we can focus on the registered participants.',
      'Inside, you will learn practical strategies to help your clinic:',
    ],
    bullets: [
      'Get discovered by local patients',
      'Build trust online',
      'Create better healthcare offers',
      'Generate inquiries through Meta Ads',
      'Convert inquiries into appointments on WhatsApp',
    ],
    closingParagraphs: [
      'At 999 PKR, this is one of the easiest investments you can make in your clinic’s growth.',
      'Don’t stay stuck in the same cycle of inconsistent patients and unpredictable income.',
    ],
    cta: 'Complete My Registration Now',
    signOff: 'See you inside,\nTeam Farhan Ali',
  },
}

const Email = ({
  name = 'Doctor',
  checkoutUrl = DEFAULTS.checkoutUrl,
  sequenceNumber = 1,
}: Props) => {
  const c = COPY[sequenceNumber] ?? COPY[1]
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{c.headline}</Heading>
          <Text style={text}>Hi {name},</Text>

          {c.paragraphs.map((p, i) => (
            <Text key={`p-${i}`} style={text}>
              {p}
            </Text>
          ))}

          {c.bullets && c.bullets.length > 0 && (
            <Section style={bulletsBox}>
              {c.bullets.map((b, i) => (
                <Text key={`b-${i}`} style={bulletItem}>
                  • {b}
                </Text>
              ))}
            </Section>
          )}

          {c.closingParagraphs?.map((p, i) => (
            <Text key={`cp-${i}`} style={text}>
              {p}
            </Text>
          ))}

          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={checkoutUrl} style={button}>
              👉 {c.cta}
            </Button>
          </Section>

          <Text style={smallText}>
            Or copy this link into your browser:
            <br />
            <a href={checkoutUrl} style={linkText}>
              {checkoutUrl}
            </a>
          </Text>

          <Hr style={hr} />

          <Text style={signature}>
            {c.signOff.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <strong>{line}</strong> : line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const previewData = { name: 'Dr. Ahmed', checkoutUrl: DEFAULTS.checkoutUrl }

export const template1 = {
  component: (props: Props) => <Email {...props} sequenceNumber={1} />,
  subject: 'You Were Just One Step Away — Complete Your Registration (999 PKR)',
  displayName: 'Abandoned Checkout #1 (immediately)',
  previewData,
} satisfies TemplateEntry

export const template2 = {
  component: (props: Props) => <Email {...props} sequenceNumber={2} />,
  subject: 'Doctor, Can You Not Invest Even 999 PKR In Your Clinic Growth?',
  displayName: 'Abandoned Checkout #2 (8 hours)',
  previewData,
} satisfies TemplateEntry

export const template3 = {
  component: (props: Props) => <Email {...props} sequenceNumber={3} />,
  subject: 'One New Patient Recovers Your 999 PKR — Let’s Be Practical',
  displayName: 'Abandoned Checkout #3 (24 hours)',
  previewData,
} satisfies TemplateEntry

export const template4 = {
  component: (props: Props) => <Email {...props} sequenceNumber={4} />,
  subject: 'Final Reminder — Registrations Closing Soon (999 PKR)',
  displayName: 'Abandoned Checkout #4 (60 hours)',
  previewData,
} satisfies TemplateEntry

export default Email

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { fontSize: '26px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 14px' }
const smallText = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '12px 0' }
const linkText = { color: '#16a34a', wordBreak: 'break-all' as const }
const bulletsBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '16px 18px',
  margin: '8px 0 18px',
}
const bulletItem = { fontSize: '15px', color: '#0f172a', lineHeight: '1.6', margin: '0 0 6px' }
const button = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const signature = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0' }
