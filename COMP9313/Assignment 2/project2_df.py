#
# COMP9313 Project 2 - Frequent item set mining in E-commerce transaction logs
#
# Problem Definition: You are given an E-Commerce dataset of customer purchase 
# transaction logs collected over time. Each record in the dataset has the 
# following five fields (see the example dataset): 
#   1. InvoiceNo: the unique ID to record one purchase transaction
#   2. Description: the name of the item in a transaction
#   3. Quantity: the amount of the items purchased
#   4. InvoiceDate: the time of the transaction
#   5. UnitPrice: the price of a single item
#
# Your task is to utilize Spark to detect the top-k frequent item sets from 
# the log for each month. To make the problem simple, you are only required 
# to find frequent item sets containing three items. The support of an item 
# set X in a month M is computed as: 
#   Support(X) = (Number of transactions containing X in M) / (Total number of transactions in M)
#
# Data Frame Version
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 01/11/2023
#

from pyspark.sql.session import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
from pyspark.sql.window import Window
from itertools import combinations
import sys

class Project2:           
    def run(self, inputPath, outputPath, k):
        spark = SparkSession.builder.master("local").appName("project2_df").getOrCreate()
        
        # df = data frame
        # separate logs into five different fields
        df = spark.read.csv(inputPath).toDF("InvoiceNo", "Description", "Quantity", "InvoiceDate", "UnitPrice")
        # display invoice date as Month/Year
        df = df.withColumn("InvoiceDate", split(col("InvoiceDate"), " ").getItem(0))
        df = df.withColumn("Month", split(col("InvoiceDate"), "/").getItem(1).cast(IntegerType()))
        df = df.withColumn("Year", split(col("InvoiceDate"), "/").getItem(2).cast(IntegerType()))
        # trans = transactions
        # group descriptions by invoice number and invoice date (month, year)
        # sort item set list alphabetically
        transDf = df.groupBy("InvoiceNo", "Month", "Year").agg(sort_array((collect_list("Description"))).alias("ItemSet"))
        # calculate total monthly transactions
        numMonthlyTransDf = transDf.groupBy("Month", "Year").agg(count("InvoiceNo").alias("TotalMonthlyTransactions"))
        # generate all possible three-item combinations
        combinationsUdf = udf(lambda itemSet: [list(result) for result in combinations(itemSet, 3)], ArrayType(StringType()))
        transDf = transDf.withColumn("ItemSet", explode(combinationsUdf("ItemSet")))
        # change item set format to: (Item 1|Item 2|Item 3)
        transDf = transDf.withColumn("ItemSet", regexp_replace(col("ItemSet"), "\[", "("))
        transDf = transDf.withColumn("ItemSet", regexp_replace(col("ItemSet"), "\]", ")"))
        transDf = transDf.withColumn("ItemSet", regexp_replace(col("ItemSet"), ", ", "|"))
        # calculate frequency for each item set 
        transDf = transDf.groupBy("Month", "Year", "ItemSet").agg(count("ItemSet").alias("Frequency"))
        # join the transDf and monthlyTransDf on invoice date (month, year)
        transDf = transDf.join(numMonthlyTransDf, ["Month", "Year"])
        # calculate support for each item set
        transDf = transDf.withColumn("Support", (col("Frequency")/col("TotalMonthlyTransactions")))
        # sort by:
        # 1. invoice date (year, month) in ascending order
        # 2. support in descending order
        # 3. item set in alphabetical order
        partitionSorter = Window.partitionBy("Month", "Year").orderBy(col("Year"), col("Month"), -col("Support"), col("ItemSet"))
        # assign row number
        sortedDf = transDf.withColumn("Rank", row_number().over(partitionSorter)).filter(col("Rank") <= k)
        # res = result
        # generate output
        res = sortedDf.select(concat(col("Month"), lit("/"), col("Year")), "ItemSet", "Support")
        # sort by:
        # 1. invoice date (year, month) in ascending order
        # 2. support in descending order
        # 3. item set in alphabetical order
        res = res.orderBy(col("Year"), col("Month"), -col("Support"), col("ItemSet"))
        # save result into outputPath
        res.write.format("csv").save(outputPath)

        spark.stop()

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Wrong arguments")
        sys.exit(-1)
    Project2().run(sys.argv[1], sys.argv[2], sys.argv[3])
