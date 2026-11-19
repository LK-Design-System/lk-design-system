import * as React from 'react';
import {TimePicker as PackageTimePicker} from '../../packages/product/src/components/forms/TimePicker.jsx';
import {TimePicker as RootTimePicker} from '../../components/forms/TimePicker.jsx';
const ranges = [{start:'08:30:10',end:'08:45:00'}] as const;
export const packageUsage = <PackageTimePicker precision="second" presentation="field" allowedTimeRanges={ranges} minTime="08:00" maxTime="09:00" />;
export const rootUsage = <RootTimePicker allowedTimeRanges={ranges} />;
// @ts-expect-error clock endpoints are strings, not timestamps or numeric offsets
export const invalidUsage = <PackageTimePicker allowedTimeRanges={[{start:12,end:30}]} />;
