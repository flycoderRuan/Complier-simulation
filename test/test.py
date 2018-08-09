from selenium import webdriver
import time
import os
driver = webdriver.Edge()
driver.get("http://www.baidu.com")
print(driver.title)
driver.find_element_by_id("kw").send_keys("selenium")
driver.find_element_by_id("su").click()
time.sleep(3)
driver.close()