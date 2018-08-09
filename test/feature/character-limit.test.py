from selenium import webdriver
import time

driver = webdriver.Firefox()
driver.get("http://localhost:8088/#/index/lexical-analysis")
print(driver.title)
res1 = ['T','=']
res2 = ['a' for i in range(1201)]
texts = driver.find_elements_by_tag_name("textarea")
#text = driver.find_element_by_tag_name("textarea")
texts[0].clear()
texts[0].send_keys(res1+res2)
time.sleep(3)
buttons = driver.find_elements_by_css_selector(".el-button.el-button--primary")
buttons[0].click()

texts[1].clear()
texts[1].send_keys(res2)

button_start_participle= driver.find_element_by_css_selector(".el-button.el-button--primary")
buttons[1].click()

button_auto_show= driver.find_element_by_css_selector(".el-button.el-button--primary.is-plain")
button_auto_show.click()

button_auto_show_again = wait(driver,50,2).until(EC.element_to_be_clickable((By.CSS_SELECTOR, '.el-button.el-button--primary.is-plain')))
#driver.quit()
#button_autoshow = 
#driver.find_element_by_class_name("el-button.el-button--primary.is-disabled.is-plain").click()
#buttons1 = driver.find_elements_by_css_selector(".el-button.el-button--default.is-disabled")
#buttons1[2].click()
#time.sleep(3)
#driver.close()