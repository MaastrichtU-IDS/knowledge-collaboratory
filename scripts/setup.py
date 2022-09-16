from setuptools import find_packages, setup

setup(
    name='knowledge-collaboratory-scripts',
    version='0.1.0',
    url='https://github.com/MaastrichtU-IDS/dsri-documentation.git',
    author='Vincent Emonet',
    author_email='vincent.emonet@gmail.com',
    description='Knowledge Collaboratory scripts',
    packages=find_packages(),
    install_requires=open("requirements.txt", "r").readlines(),
)