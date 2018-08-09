from selenium import webdriver
import time
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait as wait 
from selenium.webdriver.common.by import By 

def autoTest(driver):
	f_start_time = time.time();
	driver.get("http://localhost:8088/#/index/lexical-analysis")
	#print("Firefox: ",end="")
	texts = driver.find_elements_by_tag_name("textarea")
	#text = driver.find_element_by_tag_name("textarea")
	texts[0].clear()
	texts[0].send_keys("T1=a|b\nT2=a*")
	buttons = driver.find_elements_by_css_selector(".el-button.el-button--primary")
	buttons[0].click()

	texts[1].clear()
	texts[1].send_keys("aabb")

	button_start_participle= driver.find_element_by_css_selector(".el-button.el-button--primary")
	buttons[1].click()

	button_auto_show= driver.find_element_by_css_selector(".el-button.el-button--primary.is-plain")
	button_auto_show.click()

	button_auto_again = wait(driver,50,2).until(EC.element_to_be_clickable((By.CSS_SELECTOR, '.el-button.el-button--primary.is-plain')))
	driver.quit()
	f_end_time = time.time()
	Firefoxtime = f_end_time - f_start_time
	print(str(Firefoxtime) + "s")

driver1 = webdriver.Firefox()
print("Firefox: ",end="")
autoTest(driver1)

driver2 = webdriver.Chrome()
print("Chrome: ",end="")
autoTest(driver2)
'''
driver3 = webdriver.Edge()
print("Edge: ",end="")
autoTest(driver3)
'''
driver4 = webdriver.Ie()
print("IE: ",end="")
autoTest(driver4)
