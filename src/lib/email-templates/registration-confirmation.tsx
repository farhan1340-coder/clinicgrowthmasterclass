import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  trainingDate?: string
  trainingTime?: string
  whatsappUrl?: string
}

const DEFAULTS = {
  trainingDate: '26th July 2026 (Sunday)',
  trainingTime: '5:30 PM – 8:00 PM (Pakistan Standard Time)',
  whatsappUrl: 'https://chat.whatsapp.com/D5RErdi4ZnhJGNOOEK37c6',
}

const Email = ({
  name = 'Doctor',
  trainingDate = DEFAULTS.trainingDate,
  trainingTime = DEFAULTS.trainingTime,
  whatsappUrl = DEFAULTS.whatsappUrl,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're registered for the Clinic Growth Masterclass — details inside</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✅ You're Registered!</Heading>

        <Text style={text}>Assalam-o-Alaikum {name},</Text>

        <Text style={text}>
          Your registration for the <strong>Clinic Growth Masterclass</strong> has been received successfully.
        </Text>

        <Section style={card}>
          <Text style={cardHeader}>Here are your training details:</Text>
          <Text style={detail}>📅 <strong>Date:</strong> {trainingDate}</Text>
          <Text style={detail}>⏰ <strong>Time:</strong> {trainingTime}</Text>
          <Text style={detail}>📍 <strong>Location:</strong> Live Online Training</Text>
        </Section>

        <Text style={text}>Join the official WhatsApp Community here:</Text>
        <Text style={text}>
          <Link href={whatsappUrl} style={ctaLink}>
            👉 Join WhatsApp Community
          </Link>
        </Text>

        <Text style={textBold}>
          Please join the WhatsApp community now because all class reminders, joining links, recordings,
          updates, and support will be shared there.
        </Text>

        <Text style={text}>
          We're excited to help you build your own patient acquisition system.
        </Text>

        <Hr style={hr} />

        <Text style={signature}>
          Regards,<br />
          <strong>Team Zero Apple A Day</strong><br />
          Clinic Growth Masterclass
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: "✅ You're Registered — Clinic Growth Masterclass Details Inside",
  displayName: 'Registration Confirmation',
  previewData: {
    name: 'Dr. Ahmed',
    trainingDate: DEFAULTS.trainingDate,
    trainingTime: DEFAULTS.trainingTime,
    whatsappUrl: DEFAULTS.whatsappUrl,
  },
} satisfies TemplateEntry

export default Email

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = {
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#0f172a',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const textBold = {
  fontSize: '15px',
  color: '#0f172a',
  lineHeight: '1.6',
  margin: '0 0 16px',
  fontWeight: 'bold' as const,
}
const card = {
  backgroundColor: '#f8fafc',
  border: '2px solid #fbbf24',
  borderRadius: '10px',
  padding: '20px',
  margin: '20px 0',
}
const cardHeader = {
  fontSize: '15px',
  color: '#0f172a',
  margin: '0 0 12px',
  fontWeight: 'bold' as const,
}
const detail = {
  fontSize: '15px',
  color: '#0f172a',
  lineHeight: '1.6',
  margin: '0 0 8px',
}
const ctaLink = {
  display: 'inline-block',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const signature = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0' }
