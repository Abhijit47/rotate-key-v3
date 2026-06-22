'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconReload } from '@tabler/icons-react';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCountries } from '../hooks/use-countries';
import {
  personalInformationSchema,
  type PersonalInformationClientValues,
} from '@/lib/validators/profile-schemas';
import { AvatarUpload } from './avatar-upload';
import { ClientSession } from '@/lib/auth-client';
import { useUpdatePersonalInformation } from '@/features/users/hooks/use-user';

const languages = {
  'ar-SA': 'Arabic (Saudi Arabia)',
  'bn-BD': 'Bangla (Bangladesh)',
  'bn-IN': 'Bangla (India)',
  'cs-CZ': 'Czech (Czech Republic)',
  'da-DK': 'Danish (Denmark)',
  'de-AT': 'Austrian German',
  'de-CH': '"Swiss" German',
  'de-DE': 'Standard German (as spoken in Germany)',
  'el-GR': 'Modern Greek',
  'en-AU': 'Australian English',
  'en-CA': 'Canadian English',
  'en-GB': 'British English',
  'en-IE': 'Irish English',
  'en-IN': 'Indian English',
  'en-NZ': 'New Zealand English',
  'en-US': 'US English',
  'en-ZA': 'English (South Africa)',
  'es-AR': 'Argentine Spanish',
  'es-CL': 'Chilean Spanish',
  'es-CO': 'Colombian Spanish',
  'es-ES': 'Castilian Spanish (as spoken in Central-Northern Spain)',
  'es-MX': 'Mexican Spanish',
  'es-US': 'American Spanish',
  'fi-FI': 'Finnish (Finland)',
  'fr-BE': 'Belgian French',
  'fr-CA': 'Canadian French',
  'fr-CH': '"Swiss" French',
  'fr-FR': 'Standard French (especially in France)',
  'he-IL': 'Hebrew (Israel)',
  'hi-IN': 'Hindi (India)',
  'hu-HU': 'Hungarian (Hungary)',
  'id-ID': 'Indonesian (Indonesia)',
  'it-CH': '"Swiss" Italian',
  'it-IT': 'Standard Italian (as spoken in Italy)',
  'ja-JP': 'Japanese (Japan)',
  'ko-KR': 'Korean (Republic of Korea)',
  'nl-BE': 'Belgian Dutch',
  'nl-NL': 'Standard Dutch (as spoken in The Netherlands)',
  'no-NO': 'Norwegian (Norway)',
  'pl-PL': 'Polish (Poland)',
  'pt-BR': 'Brazilian Portuguese',
  'pt-PT': 'European Portuguese (as written and spoken in Portugal)',
  'ro-RO': 'Romanian (Romania)',
  'ru-RU': 'Russian (Russian Federation)',
  'sk-SK': 'Slovak (Slovakia)',
  'sv-SE': 'Swedish (Sweden)',
  'ta-IN': 'Indian Tamil',
  'ta-LK': 'Sri Lankan Tamil',
  'th-TH': 'Thai (Thailand)',
  'tr-TR': 'Turkish (Turkey)',
  'zh-CN': 'Mainland China, simplified characters',
  'zh-HK': 'Hong Kong, traditional characters',
  'zh-TW': 'Taiwan, traditional characters',
};

type PersonalInformationFormProps = {
  personalInformation: Pick<
    ClientSession['user'],
    | 'name'
    | 'firstName'
    | 'lastName'
    | 'image'
    | 'spokenLanguages'
    | 'country'
    | 'aboutMe'
  >;
};

export default function PersonalInformationForm(
  props: PersonalInformationFormProps,
) {
  const { personalInformation } = props;
  const router = useRouter();
  const countries = useCountries();
  const { mutateAsync, isPending } = useUpdatePersonalInformation();

  const form = useForm<PersonalInformationClientValues>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: personalInformation.firstName,
      lastName: personalInformation.lastName,
      spokenLanguages: personalInformation.spokenLanguages,
      country: personalInformation.country,
      about: personalInformation.aboutMe,
    },
    mode: 'onChange',
  });

  const onError: SubmitErrorHandler<PersonalInformationClientValues> = (
    errors,
  ) => {
    // console.log('Form errors:', errors);
    Object.keys(errors).forEach((field) => {
      const error = errors[field as keyof PersonalInformationClientValues];
      if (error) {
        toast.error(error.message);
      }
    });
    return;
  };

  const onSubmit: SubmitHandler<PersonalInformationClientValues> = (values) => {
    toast.promise(mutateAsync({ ...values }), {
      description: 'Sit back, and relax',
      descriptionClassName: 'text-[10px]',
      loading: 'Processing...',
      success: () => {
        router.refresh();
        return 'Personal information updated successfully.';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return 'Failed to update personal information';
      },
    });
  };

  return (
    <FormProvider {...form}>
      <div className='w-full h-full'>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FieldSet className={'gap-2'} disabled={isPending}>
            <FieldLegend>Personal Information</FieldLegend>
            <FieldSeparator />

            <FieldGroup className={'grid grid-cols-2 gap-4'}>
              {/* Separate avatar upload not inclued in this form */}
              <AvatarUpload personalInformation={personalInformation} />

              <FieldGroup className={'gap-2'}>
                <Controller
                  name='firstName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className='gap-2'
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                      <Input
                        id='firstName'
                        placeholder='Evil'
                        {...field}
                        value={field?.value?.length ? field.value : ''}
                        onChange={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className='text-xs'
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='lastName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className='gap-2'
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                      <Input
                        id='lastName'
                        placeholder='Rabbit'
                        aria-invalid={fieldState.invalid}
                        {...field}
                        value={field?.value?.length ? field.value : ''}
                        onChange={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className='text-xs'
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldGroup>

            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='spokenLanguages'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className='gap-2'
                    data-invalid={fieldState.invalid}
                    aria-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor='spokenLanguages'>
                      Spoken Languages
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field?.value?.length ? field.value[0] : ''}
                      onValueChange={(e) => field.onChange([e])}
                    >
                      <SelectTrigger
                        id='spokenLanguages'
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder='Ex. Hindi(India)' />
                      </SelectTrigger>
                      <SelectContent id='spokenLanguages'>
                        <SelectGroup>
                          <SelectLabel>Preferred language</SelectLabel>
                          {Object.entries(languages).map(([key, value]) => {
                            return (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError
                        className='text-xs'
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='country'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className='gap-2'
                    data-invalid={fieldState.invalid}
                    aria-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor='country'>Country</FieldLabel>
                    <Select
                      name={field.name}
                      value={field?.value?.length ? field.value : ''}
                      onValueChange={(e) => field.onChange(e)}
                    >
                      <SelectTrigger
                        id='country'
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder='India' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose a country</SelectLabel>
                          {countries.map((country) => {
                            return (
                              <SelectItem
                                key={country.iso2}
                                value={country.name}
                              >
                                <Image
                                  src={country.flag}
                                  alt={country.name}
                                  height={32}
                                  width={32}
                                  className='size-4 rounded-full'
                                />
                                {country.name} ({country.native})
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError
                        className='text-xs'
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name='about'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className='gap-2'
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor='about'>About me</FieldLabel>
                  <Textarea
                    id='about'
                    placeholder='Write a short description about yourself...'
                    className='resize-y min-h-22'
                    {...field}
                    value={field?.value?.length ? field.value : ''}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className='text-xs'
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <FieldSeparator />

            <Field orientation='horizontal' className='justify-end gap-2'>
              <Button type='submit' size={'sm'} disabled={isPending}>
                {isPending ? 'Updating...' : 'Update'}
              </Button>
              <Button
                variant='outline'
                type='button'
                size={'sm'}
                disabled={isPending}
              >
                Cancel
              </Button>
            </Field>
          </FieldSet>
        </form>
      </div>
    </FormProvider>
  );
}
