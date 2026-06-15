import type { ComponentType, SVGProps } from 'react'
import { Github, LinkedIn, Mail } from 'src/components/ui/icons'

export const email = 'mason.chinkin@gmail.com'
export const subject = 'Hi Mason'
export const body = "I would like to hire you and pay you lots o' money!"
export const mailTo = `mailto:${email}?subject=${subject}&body=${body}`

type SocialLink = {
  href: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/mason-chinkin/',
    Icon: LinkedIn,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/MasonChinkin',
    Icon: Github,
    label: 'Github',
  },
  {
    href: mailTo,
    Icon: Mail,
    label: 'Email',
  },
]
