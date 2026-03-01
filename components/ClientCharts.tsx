"use client";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface ChartProps {
    type: "area" | "bar";
    data: any[];
    dataKey: string;
    dataKey2?: string;
    colors: string[];
}

export default function ClientCharts({ type, data, dataKey, dataKey2, colors }: ChartProps) {
    if (type === "area") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--ds-surface)',
                            border: '1px solid var(--ds-border)',
                            borderRadius: '8px'
                        }}
                        itemStyle={{ color: 'var(--ds-text)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={colors[0]}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        strokeWidth={3}
                    />
                    {dataKey2 && (
                        <Area
                            type="monotone"
                            dataKey={dataKey2}
                            stroke={colors[1]}
                            fill="transparent"
                            strokeDasharray="5 5"
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    type="category"
                    dataKey="subject"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--ds-surface)',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px'
                    }}
                    itemStyle={{ color: 'var(--ds-text)' }}
                />
                <Bar dataKey={dataKey} fill={colors[0]} radius={[0, 4, 4, 0]} barSize={12} />
                {dataKey2 && (
                    <Bar dataKey={dataKey2} fill={colors[1]} radius={[0, 4, 4, 0]} barSize={12} />
                )}
            </BarChart>
        </ResponsiveContainer>
    );
}
