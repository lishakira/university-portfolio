#
# COMP9313 Project 1 - Anomaly detection from sensor readings
#
# Problem Definition: You are given a dataset of sensor readings collected over time. 
# Each record in the dataset consists of a station name where the sensor is located, 
# a date, and a numerical sensor reading value reporting the humidity. A sample input 
# file has been provided. Your task is to utilize MRJob to detect anomalies from the 
# readings for each sensor based on the following steps:
#   1. For each sensor, calculate the daily average humidity (daily average for short).
#   2. For each sensor, calculate the overall average humidity (overall average for short)
#   3. For each sensor on each day, calculate the gap between the daily and the overall average.
#   4. Report all the readings such that the gap between the daily average and the overall 
#   average for that sensor on that day is larger than a given threshold τ. 
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 09/10/2023
#

from mrjob.job import MRJob
from mrjob.step import MRStep
from mrjob.compat import jobconf_from_env

class proj1(MRJob):   
    def mapper(self, _, line):
        # split the line using ',' into three columns: station, date, humidity
        station, date, humidity = line.strip().split(",")
        # key = station, date -> helps map the humidities by station and date
        # values = float(humidity) 
        yield station + "," + date, float(humidity)
        # special key = *
        yield station + ",*", float(humidity)

    def combiner(self, key, values):
        humidities_list = list(values)
        sum_humidities = sum(humidities_list)
        num_sensors = len(humidities_list)
        # key = station, date
        # values = sum of humidities, number of sensors -> helps calculate the daily and overall average humidity
        yield key, str(sum_humidities) + "," + str(num_sensors)

    def reducer_init(self):
        # contains all the daily averages per station and date
        self.daily_average_list = {}
        # contains the sum of humidities and number of sensors per station
        self.all_humidities_list = {}
        
    def reducer(self, key, values):
        station, date = key.split(",")

        # contains the overall sum of humidity readings per day
        overall_sum_humidities = 0.0
        # contains the overall number of sensors per day
        overall_num_sensors = 0.0
        for value in values:
            sum_humidities, num_sensors = value.split(",")
            overall_sum_humidities += float(sum_humidities)
            overall_num_sensors += float(num_sensors)

        if date == "*":
            if station in self.all_humidities_list:
                # sum of all humidities per station
                self.all_humidities_list[station][0] += overall_sum_humidities
                # number of sensors per station
                self.all_humidities_list[station][1] += overall_num_sensors
            else:
                # new entry per station
                self.all_humidities_list[station] = [overall_sum_humidities, overall_num_sensors]
        else:
            # calculates the daily average humidity
            daily_average = overall_sum_humidities / overall_num_sensors
            # key = station, date
            self.daily_average_list[key] = daily_average
                
        
    def reducer_final(self):
        for k, daily_average in self.daily_average_list.items():
            station, date = k.split(",")
            # calculates the overall average humidity
            overall_average = self.all_humidities_list[station][0] / self.all_humidities_list[station][1]
            # calculates the gap between the overall average and daily average humidities
            gap = abs(overall_average - daily_average)
            # tau = given threshold
            tau = jobconf_from_env('myjob.settings.tau')

            if gap > float(tau):
                yield f"{station}", f"{date},{gap}"

    SORT_VALUES = True

    def steps(self):
        JOBCONF = {
        'stream.num.map.output.key.fields':2,
        'mapreduce.map.output.key.field.separator':',',
        'mapreduce.job.partitioner': 'org.apache.hadoop.mapred.lib.KeyFieldBasedPartitioner',
        'mapreduce.partition.keypartitioner.options':'-k1,1', 
        'mapreduce.job.output.key.comparator.class':'org.apache.hadoop.mapreduce.lib.partition.KeyFieldBasedComparator',
        'mapreduce.partition.keycomparator.options':'-k1,1 -k2,2r' 
        }

        return [MRStep(jobconf=JOBCONF, 
                       mapper=self.mapper,
                       combiner=self.combiner,
                       reducer=self.reducer,
                       reducer_init=self.reducer_init,
                       reducer_final=self.reducer_final)]

if __name__ == '__main__':
    proj1.run()