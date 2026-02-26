import dailyTotalsPageAtom, {
  defaultDailyTotalsPageState,
} from "@/atoms/daily-totals-page-atom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import useDailyTotalsGraphql from "./use-daily-totals-graphql";
import { convertSeconds } from "@/utils/time";

const useDailyTotals = () => {
  // const { generateHeaders } = useDailyTotalsGraphql();
  const [recoilState, setRecoilState] = useRecoilState(dailyTotalsPageAtom);

  type IDailyTotalsPageState = typeof recoilState;

  type IDailyTotalsPageStateKey = keyof IDailyTotalsPageState;

  type IPartialDailyTotalsPageState = {
    [Property in IDailyTotalsPageStateKey]?: IDailyTotalsPageState[Property];
  };

  const [dailyTotalsPageState, setdailyTotalsPageState] =
    useState<IDailyTotalsPageState>(defaultDailyTotalsPageState);

  const getTableHeader = useCallback(() => {
    return recoilState.tableHeaders;
  }, [dailyTotalsPageState, recoilState]);

  const getDailyTotals = useCallback(
    (searchString?: string) => {
      let totals: any[] = [""]; //convertArrayToObject(dailyTotalsPageState.tableHeaders, 'title');
      let totalsActive = 0;
      let cumulativeTotals = 0;
      let cumulativeBreak = 0;
      
      const isSingleDate = dailyTotalsPageState.tableHeaders.length === 4; // Member + 1 date + Break/Total + Activity
      
      let data = dailyTotalsPageState?.timeAndActivity
        ?.filter((user: any) => {
          const matchesSearch = searchString === undefined || searchString === "" 
            ? true 
            : user?.name.toLocaleLowerCase()?.includes(searchString.toLocaleLowerCase());
          
          const matchesLocation = !dailyTotalsPageState.selectedLocation || dailyTotalsPageState.selectedLocation === ""
            ? true
            : user?.location && user.location.toLowerCase().includes(dailyTotalsPageState.selectedLocation.toLowerCase());
          
          return matchesSearch && matchesLocation;
        })
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((item) => {
          let modActivity: string[] = [];
          let userTotal = 0;
          let userActive = 0;
          let userBreak = 0;
          for (
            let i = 1;
            i < dailyTotalsPageState.tableHeaders.length - 2;
            i++
          ) {
            let temp = 0;
            item.activity.forEach((header, index) => {


              if (header.date === dailyTotalsPageState.tableHeaders[i].title) {
                userActive += header.active;
                totalsActive += header.active;
                // totalsActive += header.active
                temp = header.total;
                // If single date, also accumulate break time
                if (isSingleDate && header.breakTime !== undefined) {
                  userBreak += header.breakTime;
                }
              }
            });
            userTotal += temp;
            totals[i] = Number(totals[i]) ? totals[i] + temp : temp;
            cumulativeTotals += temp;

            temp === 0
              ? modActivity.push(convertSeconds(0))
              : modActivity.push(convertSeconds(temp));
            console.log(
              userActive,
              totalsActive,
              temp,
              "new daily totals data after user activity"
            );
          }
          
          if (isSingleDate) {
            modActivity.push(convertSeconds(userBreak));
            cumulativeBreak += userBreak;
          } else {
            modActivity.push(convertSeconds(userTotal));
          }

          modActivity.push(((userActive / userTotal) * 100).toFixed(0));
          return { 
            ...item, 
            activity: modActivity,
            location: (item as any).location || ""
          };
        });
      
      totals.push(isSingleDate ? cumulativeBreak : cumulativeTotals);
      totals.push(
        Number(totals[totals.length - 1])
          ? (totalsActive / cumulativeTotals) * 100
          : 0
      );
      console.log(data, totalsActive, totals, "new daily totals data after");
      return {
        aggregate: totals.map((total, index) =>
          index !== totals.length - 1 && total !== ""
            ? convertSeconds(total)
            : total === ""
            ? total
            : Number(total).toFixed(0)
        ),
        data: data,
      };
    },
    [dailyTotalsPageState, recoilState]
  );

  const updateDailyTotalsPage = useCallback(
    (update: IPartialDailyTotalsPageState) => {
      console.log(update, "daily totals update values");
      setRecoilState((prevState) => ({
        ...prevState,
        ...update,
      }));
    },
    [recoilState, setRecoilState]
  );

  useEffect(() => {
    setdailyTotalsPageState(recoilState);
  }, [recoilState]);

  const getChartData1: any = useCallback(() => {
    let chartData: { user: any; time: number }[] =
      dailyTotalsPageState.chartData;
    let unique: any[] = [];
    chartData = [...chartData];
    let genIndex: number[] = [];
    for (let index = 0; index < chartData.length; index++) {
      let data = chartData[index];
      let value: any = { ...data };
      let indices = [];
      for (let i = index + 1; i < chartData.length; i++) {
        if (chartData[i].user.id === data.user.id) {
          indices.push(i);
          genIndex.push(chartData[i].user.id);
        }
      }
      if (indices.length > 0) {
        indices.forEach((i) => (value.time += chartData[i].time));
      }
      unique.find((i) => i.user.id === value.user.id)
        ? null
        : unique.push(value);
    }
    let labels: string[] = [];
    let data: number[] = [];
    let names: any[] = [];
    unique.forEach((item) => {
      labels.push(
        item.user.name.split(" ")[0][0] + "" + item.user.name.split(" ")[1][0]
      );
      names.push({ name: item.user.name, time: item.time });
      data.push(item.time);
    });
    return {
      labels: labels,
      datasets: [
        {
          label: "",
          names: names,
          data: data,
          backgroundColor: "rgb(36, 75, 182)",
          tooltip: { callbacks: () => "returned" },
        },
      ],
    };
  }, [dailyTotalsPageState]);

  const getChartData: any = useCallback(() => {
    return dailyTotalsPageState.stackedBarChartData;
  }, [dailyTotalsPageState]);

  const getDateRange: any = useCallback(() => {
    return {
      ...recoilState.dateRange,
      selectedLocation: recoilState.selectedLocation
    };
  }, [dailyTotalsPageState, recoilState]);

  return useMemo(
    () => ({
      dailyTotalsPageState,
      getChartData,
      updateDailyTotalsPage,
      getDailyTotals,
      getTableHeader,
      getDateRange,
    }),
    [
      dailyTotalsPageState,
      getChartData,
      updateDailyTotalsPage,
      getDailyTotals,
      getTableHeader,
      getDateRange,
    ]
  );
};

export default useDailyTotals;
