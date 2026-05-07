type Props = {
  params: Promise<{
    // { profile: [ 'private' ] }
    profile?: 'private' | 'public';
  }>;
  searchParams: Promise<{
    type: 'private' | 'public';
  }>;
};

type PageProps<T extends string> = Props & {
  params: Promise<
    Record<string, string | string[] | undefined> & {
      [key in T extends `${infer _}[${infer Param}]${infer Rest}`
        ? Param
        : never]: string | string[] | undefined;
    }
    // Record<string, string | string[] | undefined> & {
    //   profile?: ['private'] | ['public'];
    // }
  >;
};

export default async function ProfilePage(
  props: PageProps<'/profile/[[...profile]]'>,
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  // console.log('params', params.profile);
  console.log('searchParams', searchParams);
  return <div>{searchParams.type} ProfilePage</div>;
}
