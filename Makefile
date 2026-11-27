.PHONY: check test

check:
	python3 check_terms.py

test:
	python3 -m unittest -v test_check_terms.py
