#!/usr/bin/env python
# -*- coding: utf-8 -*-
import xlrd
import json
import os
import sys
import shutil

outPath = "./outTs/"
headStr = 'export {}; \nif (!globalThis.i18nConfig) globalThis.i18nConfig = {};\nglobalThis.i18nConfig.'

def readFromExcel(filepath, dicts):
    wr = xlrd.open_workbook(filepath)
    sheet1 = wr.sheet_by_index(0)
    rows = sheet1.nrows
    cols = sheet1.ncols
    for i in range(1, cols):
        key_col = str(sheet1.cell(0, i).value)
        if key_col not in dicts and key_col != "":
            dicts[key_col] = {}
        for j in range(1, rows):
            _value = str(sheet1.cell(j, i).value)
            valueKey = str(sheet1.cell(j, 0).value)
            if _value != '' and valueKey:
                _value = _value.replace("\\n", "\n")
                if dicts[key_col].get(valueKey) is not None:
                    print("！！！重复警告！！！ = ", valueKey,"\n")
                dicts[key_col][valueKey] = _value
    return dicts

def write_json(dicts, filename):
    for key in dicts:
        fileName = outPath+key + ".ts"
        with open(fileName, "w+", encoding='utf-8') as fo:
            fo.write(headStr + key + " = ")
            fo.write(json.dumps(dicts[key], indent= 4, sort_keys=True, ensure_ascii=False))
    

if __name__ == '__main__':
    file_list = os.listdir()
    xlsxpath_list = []
    for file_name in file_list:
        if file_name[-5:] == ".xlsx" :
            xlsxpath_list.append(os.path.join("./", file_name))
            
    dicts = {}
    for filepath in xlsxpath_list:
        print("xlsx filename =",filepath)
        if not os.path.isfile(filepath):
            print(filepath, "is not exits")
        else:
            dicts = readFromExcel(filepath, dicts)

    if dicts:
        arr = file_list[0].split("/")
        excelname = arr[len(arr) - 1].split(".")[0] + ".json"
        write_json(dicts, excelname)

    