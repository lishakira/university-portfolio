#
# COMP9313 Project 3 - Similarity Join in E-commerce Transaction Logs
#
# Problem Definition: In this project, we are still going to use the E-Commerce 
# dataset of customer purchase transaction logs. Each record in the dataset has 
# the following five fields (see the example dataset): 
#   1. InvoiceNo: the unique ID to record one purchase transaction
#   2. Description: the name of the item in a transaction (a name can contain multiple characters)
#   3. Quantity: the amount of the items purchased
#   4. InvoiceDate: the time of the transaction
#   5. UnitPrice: the price of a single item
# Each transaction contains a set of items purahced. For example, in the sample dataset, 
# we have transactoin 1 = {A, B, C}, trasaction 2 = {A, C, DD} and transaction 3 = {A, B, C, DD}. 
# Your task is to utilize Spark to find all the similar transaction pairs across different years. 
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 23/11/2023
#

import sys
from pyspark import SparkConf, SparkContext
from pyspark.sql.session import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

@udf(returnType=IntegerType())
def processYear(InvoiceDate):
    temp = InvoiceDate.split()[0].split("/")
    # return year
    return int(temp[2])

class project3:
    def run(self, inputpath, outputpath, k):
        spark = SparkSession.builder.master("local").appName("project3_df").getOrCreate()
        # df = data frame
        # separate logs into five different fields
        schema = "InvoiceNo INTEGER, Description STRING, Quantity STRING, InvoiceDate STRING, UnitPrice STRING"
        df = spark.read.csv(inputpath, schema=schema)
        # get only the year from the invoice date
        df = df.withColumn("Year", processYear("InvoiceDate"))
        # freq = frequency
        # calculate frequency of tokens (Description)
        freqDf = df.groupBy("Description").agg((count("Description")).alias("Frequency"))
        # sort frequency in ascending order
        freqDf = freqDf.join(df, ["Description"]).sort(col("Frequency"))
        # recs = records
        # group descriptions by invoice number and year
        recsDf = freqDf.groupBy("InvoiceNo", "Year").agg((collect_list("Description")).alias("ItemSet"))
        # calculate prefix length
        recsDf = recsDf.withColumn("PrefixLength", floor(size(col("ItemSet")) - (size(col("ItemSet")) * k) + 1))
        # generate prefix tokens = least frequent tokens from ItemSet
        recsDf = recsDf.withColumn("Prefix", explode(slice(col("ItemSet"), 1, col("PrefixLength"))))
        # cond = condition
        # 1. prefixes are the same
        # 2. first invoice number > second invoice number
        # 3. years are not the same
        cond = [col("firstRec.Prefix") == col("secondRec.Prefix"), col("firstRec.InvoiceNo") < col("secondRec.InvoiceNo"), col("firstRec.Year") != col("secondRec.Year")]
        combinedDf = recsDf.alias("firstRec").join(recsDf.alias("secondRec"), cond)
        # remove duplicates
        combinedDf = combinedDf.select(col("firstRec.InvoiceNo").alias("InvoiceNo1"), col("secondRec.InvoiceNo").alias("InvoiceNo2"), col("firstRec.ItemSet"), col("secondRec.ItemSet"), col("firstRec.Year"), col("secondRec.Year")).distinct()
        # calculate similarity
        combinedDf = combinedDf.withColumn("Similarity", size(array_intersect(col("firstRec.ItemSet"), col("secondRec.ItemSet"))) / size(array_union(col("firstRec.ItemSet"), col("secondRec.ItemSet"))))
        # filter out similarity < k
        combinedDf = combinedDf.filter(col("Similarity") >= k)
        # sort by:
        # 1. first invoice number 
        # 2. second invoice number 
        combinedDf = combinedDf.sort(col("InvoiceNo1"), col("InvoiceNo2"))
        # res = result
        # format output
        res = combinedDf.selectExpr('format_string("(%s,%s):%s", InvoiceNo1, InvoiceNo2, Similarity) as Output')
        # save result into outputpath
        res.write.format("csv").save(outputpath)
        
if __name__ == '__main__':
    project3().run(sys.argv[1], sys.argv[2], sys.argv[3])
    
