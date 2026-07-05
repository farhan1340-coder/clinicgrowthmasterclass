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
import {
  MASTERCLASS_DATE_ISO,
  formatCohortDate,
  formatCohortTime,
} from '@/lib/cohort'

interface Props {
  name?: string
  checkoutUrl?: string
  variant?: '4h' | '1h'
  cohortDate?: string
  cohortTime?: string
}

const DEFAULT_CHECKOUT = 'https://www.zeroappleaday.site/order'

const COPY = {
  '4h': {
    subject: '4 hours left to join the Clinic Growth Masterclass',
    preview: 'Starts today — complete your registration before it begins',
    heading: '4 Hours Left',
    body: (name: string, time: string) => [
      `Hi ${name},`,
      `The Clinic Growth Masterclass starts today at ${time}.`,
      'You started your registration but did not complete it.',
      'This is your chance to learn practical strategies to attract more patients, build trust online, create stronger offers, and turn inquiries into appointments.',
      'You still have time to secure your seat.',
    ],
    cta: 'Complete My Registration',
    signOff: 'See you inside,\nTeam Farhan Ali',
  },
  '1h': {
    subject: 'Starts in 1 hour — last chance to join',
    preview: 'The Clinic Growth Masterclass begins in 1 hour',
    heading: 'Starts In 1 Hour ⏰',
    body: (name: string, time: string) => [
      `Hi ${name},`,
      `The Clinic Growth Masterclass starts in just 1 hour at ${time}.`,
      'Registration is closing very soon.',
      'If you want to learn how to build a practical patient acquisition system for your clinic, complete your registration now.',
    ],
    cta: 'Secure My Seat Now',
    signOff: 'Regards,\nTeam Farhan Ali',
  },
} as const

const Email = ({
  name = 'Doctor',
  checkoutUrl = DEFAULT_CHECKOUT,
  variant = '4h',
  cohortDate,
  cohortTime,
}: Props) => {
  const c = COPY[variant]
  const dateLabel = cohortDate ?? formatCohortDate(MASTERCLASS_DATE_ISO)
  const timeLabel = cohortTime ?? formatCohortTime(MASTERCLASS_DATE_ISO)
  const paragraphs = c.body(name, timeLabel)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{c.heading}</Heading>
          <Section style={eventBox}>
            <Text style={eventLabel}>Clinic Growth Masterclass</Text>
            <Text style={eventDetail}>
              {dateLabel} · {timeLabel}
            </Text>
          </Section>
          {paragraphs.map((p, i) => (
            <Text key={i} style={text}>
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

const previewData = {
  name: 'Dr. Ahmed',
  checkoutUrl: DEFAULT_CHECKOUT,
  cohortDate: formatCohortDate(),
  cohortTime: formatCohortTime(),
}

export const template5 = {
  component: (props: Props) => <Email {...props} variant="4h" />,
  subject: COPY['4h'].subject,
  displayName: 'Abandoned Checkout #5 (4h before cohort)',
  previewData: { ...previewData, variant: '4h' as const },
} satisfies TemplateEntry

export const template6 = {
  component: (props: Props) => <Email {...props} variant="1h" />,
  subject: COPY['1h'].subject,
  displayName: 'Abandoned Checkout #6 (1h before cohort)',
  previewData: { ...previewData, variant: '1h' as const },
} satisfies TemplateEntry

export default Email

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { fontSize: '26px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 14px' }
const smallText = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '12px 0' }
const linkText = { color: '#16a34a', wordBreak: 'break-all' as const }
const eventBox = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #a7f3d0',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 18px',
}
const eventLabel = { fontSize: '12px', color: '#047857', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 'bold' as const }
const eventDetail = { fontSize: '15px', color: '#065f46', margin: 0, fontWeight: 'bold' as const }
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
