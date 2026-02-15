import { TranslationConfig } from '@c15t/nextjs';
import { Locale } from 'next-intl';

export function getTranslatedCookieBanner(
  locale: Locale,
): Partial<TranslationConfig> {
  return {
    defaultLanguage: locale,
    translations: {
      en: {
        common: {
          acceptAll: 'Accept all',
          rejectAll: 'Reject all',
          customize: 'Customize',
          save: 'Save',
        },
        consentManagerDialog: {
          title: 'Cookie Preferences',
          description:
            'Manage your cookie preferences. You can change these settings at any time.',
        },
        consentTypes: {
          necessary: {
            title: 'Necessary Cookies',
            description:
              'These cookies are essential for the website to function and cannot be switched off in our systems.',
          },
          marketing: {
            title: 'Marketing Cookies',
            description:
              'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
          },
          experience: {
            title: 'Experience Cookies',
            description:
              'These cookies allow us to remember your preferences and provide a more personalized experience.',
          },
          functionality: {
            title: 'Functionality Cookies',
            description:
              'These cookies enable enhanced functionality and personalization, such as videos and live chats.',
          },
          measurement: {
            title: 'Measurement Cookies',
            description:
              'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
          },
        },
        cookieBanner: {
          title: 'We value your privacy',
          description:
            "We use cookies to enhance your experience. By clicking 'Accept all', you consent to the use of all cookies. You can manage your preferences in the settings.",
        },
        frame: {
          title: 'This content requires additional consent',
          actionButton: 'Manage Consent',
        },
        legalLinks: {
          privacyPolicy: 'Privacy Policy',
          cookiePolicy: 'Cookie Policy',
          termsOfService: 'Terms of Service',
        },
      },

      'bn-IN': {
        common: {
          acceptAll: 'Accept all',
          rejectAll: 'Reject all',
          customize: 'Customize',
          save: 'Save',
        },
        consentManagerDialog: {
          title: 'Cookie Preferences',
          description:
            'Manage your cookie preferences. You can change these settings at any time.',
        },
        consentTypes: {
          necessary: {
            title: 'Necessary Cookies',
            description:
              'These cookies are essential for the website to function and cannot be switched off in our systems.',
          },
          marketing: {
            title: 'Marketing Cookies',
            description:
              'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
          },
          experience: {
            title: 'Experience Cookies',
            description:
              'These cookies allow us to remember your preferences and provide a more personalized experience.',
          },
          functionality: {
            title: 'Functionality Cookies',
            description:
              'These cookies enable enhanced functionality and personalization, such as videos and live chats.',
          },
          measurement: {
            title: 'Measurement Cookies',
            description:
              'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
          },
        },
        cookieBanner: {
          title: 'We value your privacy',
          description:
            "We use cookies to enhance your experience. By clicking 'Accept all', you consent to the use of all cookies. You can manage your preferences in the settings.",
        },
        frame: {
          title: 'This content requires additional consent',
          actionButton: 'Manage Consent',
        },
        legalLinks: {
          privacyPolicy: 'Privacy Policy',
          cookiePolicy: 'Cookie Policy',
          termsOfService: 'Terms of Service',
        },
      },

      'hi-IN': {
        common: {
          acceptAll: 'सभी स्वीकार करें',
          rejectAll: 'सभी अस्वीकार करें',
          customize: 'अनुकूलित करें',
          save: 'सहेजें',
        },
        consentManagerDialog: {
          title: 'कुकी प्राथमिकताएँ',
          description:
            'अपनी कुकी प्राथमिकताओं का प्रबंधन करें। आप कभी भी इन सेटिंग्स को बदल सकते हैं।',
        },
        consentTypes: {
          necessary: {
            title: 'आवश्यक कुकीज़',
            description:
              'ये कुकीज़ वेबसाइट के काम करने के लिए आवश्यक हैं और हमारे सिस्टम में इन्हें बंद नहीं किया जा सकता।',
          },
          marketing: {
            title: 'मार्केटिंग कुकीज़',
            description:
              'ये कुकीज़ वेबसाइटों के बीच आगंतुकों को ट्रैक करने के लिए उपयोग की जाती हैं। उद्देश्य यह है कि उपयोगकर्ता के लिए प्रासंगिक और आकर्षक विज्ञापन प्रदर्शित करना।',
          },
          experience: {
            title: 'अनुभव कुकीज़',
            description:
              'ये कुकीज़ हमें आपकी प्राथमिकताओं को याद रखने और एक अधिक व्यक्तिगत अनुभव प्रदान करने की अनुमति देती हैं।',
          },
          functionality: {
            title: 'कार्यात्मक कुकीज़',
            description:
              'ये कुकीज़ उन्नत कार्यक्षमता और वैयक्तिकरण सक्षम करती हैं, जैसे वीडियो और लाइव चैट।',
          },
          measurement: {
            title: 'मापन कुकीज़',
            description:
              'ये कुकीज़ हमें यह समझने में मदद करती हैं कि आगंतुक हमारी वेबसाइट के साथ कैसे इंटरैक्ट करते हैं, जानकारी को गुमनाम रूप से एकत्र और रिपोर्ट करके।',
          },
        },
        cookieBanner: {
          title: 'हम आपकी गोपनीयता को महत्व देते हैं',
          description:
            "हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। 'सभी स्वीकार करें' पर क्लिक करके, आप सभी कुकीज़ के उपयोग के लिए सहमति देते हैं। आप सेटिंग्स में अपनी प्राथमिकताओं का प्रबंधन कर सकते हैं।",
        },
        frame: {
          title: 'इस सामग्री के लिए अतिरिक्त सहमति की आवश्यकता है',
          actionButton: 'सहमति प्रबंधित करें',
        },
        legalLinks: {
          privacyPolicy: 'गोपनीयता नीति',
          cookiePolicy: 'कुकी नीति',
          termsOfService: 'सेवा की शर्तें',
        },
      },
    },
  };
}
