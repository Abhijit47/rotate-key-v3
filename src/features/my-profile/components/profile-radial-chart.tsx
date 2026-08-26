'use client';

import { TrendingUp } from 'lucide-react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { useUserProfileCompletionRatio } from '@/features/users/hooks/use-user';

export const description = 'A radial chart with text';

const chartData = [
  { browser: 'safari', visitors: 75, fill: 'var(--color-primary)' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export default function ProfileRadialChart() {
  const { data } = useUserProfileCompletionRatio();

  // const fakePercentage = 100;

  return (
    <Card className='flex flex-col justify-center h-full'>
      {/* <CardHeader className='items-center pb-0'>
        <CardTitle>Radial Chart - Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className='flex flex-1 justify-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='w-full h-full aspect-square'>
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(data.percentage / 100) * 360}
            // endAngle={(fakePercentage / 100) * 360}
            // outerRadius={90}
            // innerRadius={80}
            outerRadius={110}
            innerRadius={100}>
            <PolarGrid
              gridType='circle'
              radialLines={false}
              stroke='none'
              className='first:fill-primary/30'
              polarRadius={[110, 120]}
            />
            <RadialBar
              dataKey='visitors'
              background
              cornerRadius={10}
              fill='#fff'
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-primary dark:fill-primary-foreground font-bold text-4xl'>
                          {data.percentage} %{/* {fakePercentage} % */}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-primary dark:fill-primary-foreground'>
                          Completed
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='w-4 h-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          No of visitors (This week): 850
        </div>
      </CardFooter>
    </Card>
  );
}
