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
# RDD Version
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 01/11/2023
#

from pyspark import SparkContext, SparkConf
from operator import add
from itertools import combinations
import re
import sys

# mapping of input variables
invoiceNo = 0
description = 1
quantity = 2
invoiceDate = 3
unitPrice = 4

class Project2:  
    def run(self, inputPath, outputPath, k):
        conf = SparkConf().setAppName("project2_rdd").setMaster("local")
        sc = SparkContext(conf=conf)

        # separate logs into five different fields
        mappedFile = sc.textFile(inputPath).map(lambda line: line.split(","))
        # map by invoice number, invoice date (month, year), and description
        mappedFile = mappedFile.map(lambda x: ((x[invoiceNo], int(x[invoiceDate].split(" ")[0].split("/")[1]), int(x[invoiceDate].split(" ")[0].split("/")[2])), x[description]))
        # trans = transactions
        # group descriptions by invoice number and invoice date
        trans = mappedFile.groupByKey().mapValues(list)
        # [0] = invoice number and invoice date (month, year)
        # [1] = item set
        # sort item set list alphabetically
        trans = trans.map(lambda x: (x[0], sorted(x[1])))
        # [0][1] = month
        # [0][2] = year
        # calculate total monthly transactions
        monthlyTrans = trans.map(lambda x: ((x[0][1], x[0][2]), 1)).reduceByKey(add)
        # [0][1] = invoice date
        # generate all possible three-item combinations
        trans = trans.flatMap(lambda x: [((x[0][1], x[0][2]), result) for result in combinations(x[1], 3)])
        # calculate frequency for each item set 
        trans = trans.map(lambda x: (x, 1)).reduceByKey(add)
        # [0][0][0] = month
        # [0][0][1] = year
        # [0][1] = item set
        # [1] = frequency of item set
        # join the trans and monthlyTrans on invoice date
        trans = trans.map(lambda x: ((x[0][0][0], x[0][0][1]), (x[0][1], x[1]))).join(monthlyTrans)
        # [1][0][0] = item set
        # [0] = invoice date
        # [1][0][1] = frequency of item set
        # [1][1] = total number of transactions
        # calculate support for each item set
        trans = trans.map(lambda x: ((x[0][0], x[0][1], x[1][0][0]), x[1][0][1] / x[1][1]))
        # [0][0] = month 
        # [0][1] = year 
        # [0][2] = item set
        # [1] = support
        # group item set and support by invoice date (month, year)
        trans = trans.map(lambda x: ((x[0][0], x[0][1]), (x[0][2], x[1])))
        trans = trans.groupByKey().mapValues(list)
        # [0] = month, year
        # [1][1] = support
        # [1][0] = item set
        # filter the top-k result per month
        trans = trans.flatMap(lambda x: [(x[0], item) for item in (sorted(x[1], key=lambda y: (-y[1], y[0]))[:int(k)])])
        # sort by:
        # [0][1], [0][0] = invoice date (year, month) in ascending order
        # [1][1] = support in descending order
        # [1][0] item set in alphabetical order
        sortedTrans = trans.sortBy(lambda x: (x[0][1], x[0][0], -x[1][1], x[1][0]))
        # generate output
        res = sortedTrans.map(lambda x: f"{x[0][0]}/{x[0][1]},({'|'.join([str(item) for item in x[1][0]])}),{x[1][1]}")
        # save result into outputPath
        res.saveAsTextFile(outputPath)

        sc.stop()

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Wrong arguments")
        sys.exit(-1)
    Project2().run(sys.argv[1], sys.argv[2], sys.argv[3])
