#!/usr/bin/env python3

import re
import json
import sys

filenames = [
    './scripts/data/scarlet-violet/raid/1star-data.txt',
    './scripts/data/scarlet-violet/raid/2star-data.txt',
    './scripts/data/scarlet-violet/raid/3star-data.txt',
    './scripts/data/scarlet-violet/raid/4star-data.txt',
    './scripts/data/scarlet-violet/raid/5star-data.txt',
    './scripts/data/scarlet-violet/raid/6star-data.txt',
]

# Notes
#
# Row separator: \n\t\t\t\t\t\n
# First record: List of pokemon -- use length to get fields
# Format: Label\nData\t -- goes for n fields -- then \n
# After all fields of a given type, \n comes up on its own, but can come up internally as well.
#

title = ''

# Record format
# Pokemon: string
# Game?: string
# Level: integer
# Ability?: string
# Moves: string[]
# ItemDrops: {
#   Item: string
#   Quantity: integer
#   Probability: float
#   Who: string # Host | Guest | None
# }[]

fields = ['Game?', 'Level', 'Tera Type', 'Ability?', 'Moves', 'Item Drops:']
allRecords = []

for filename in filenames:
    records = []
    outputFilename = '/'.join(['public/data/scarlet-violet/raid',
                              '.'.join([filename.split('/')[-1].split('-')[0], 'json'])])
    with open(filename) as f:
        data = f.read()

    for row in re.split(r'\n\t+\n', data):
        if (row.startswith('Tera Raid Battles')):
            continue
        else:
            rowPokemon = list(
                map(lambda pokemon: {'Pokemon': pokemon}, row.split('\n')[0].split('\t')))
            rowData = '\n'.join(row.split('\n')[1:])

            rowDataIndex = 0
            newRowDataIndex = 0
            fieldIndex = -1
            pokemonIndex = 0

            fieldName = None
            fieldData = None
            try:
                while (rowDataIndex < len(rowData)):
                    if pokemonIndex == 0:
                        fieldIndex += 1
                        fieldIndex %= len(fields)
                    if (fields[fieldIndex] in ['Game?', 'Level', 'Tera Type', 'Ability?']):
                        # Last field has a \n and no \t
                        if pokemonIndex == len(rowPokemon) - 1:
                            newRowDataIndex = rowData.find(
                                fields[fieldIndex+1], rowDataIndex) - 1
                        else:
                            newRowDataIndex = rowData.find('\t', rowDataIndex)

                        [fieldName, *fieldData] = rowData[rowDataIndex:newRowDataIndex].strip().split('\n')

                        if fields[fieldIndex] == 'Level':
                            if len(fieldData) % 2 == 0:
                                levels = {}
                                for i in range(0, len(fieldData), 2):
                                    levels[fieldData[i]] = int(
                                        fieldData[i+1].replace('Lv. ', ''))

                                fieldData = levels
                            else:
                                fieldData = int(
                                    fieldData[0].replace('Lv. ', ''))
                        elif len(fieldData) == 1:
                            fieldData = fieldData[0]

                    elif (fields[fieldIndex] == 'Moves'):
                        if (pokemonIndex == len(rowPokemon) - 1):
                            newRowDataIndex = rowData.find(
                                fields[fieldIndex + 1], rowDataIndex) - 1
                        else:
                            newRowDataIndex = rowData.find('\t', rowDataIndex)

                        [fieldName, *fieldData] = rowData[rowDataIndex:newRowDataIndex].strip().split('\n')

                        additionalMoves = []
                        if 'Additional Moves' in fieldData:
                            index = fieldData.index('Additional Moves')
                            additionalMoves = fieldData[index + 1:]
                            fieldData = fieldData[:index]

                        rowPokemon[pokemonIndex]['AdditionalMoves'] = additionalMoves

                    elif (fields[fieldIndex] == 'Item Drops:'):
                        if (pokemonIndex == len(rowPokemon) - 1):
                            newRowDataIndex = len(rowData)  # end of file
                        else:
                            newRowDataIndex = rowData.find(
                                '\n\t', rowDataIndex)

                        [fieldName, *fieldData] = rowData[rowDataIndex:newRowDataIndex].strip().split('\n')
                        itemDrops = []
                        for line in fieldData:
                            if ('%' in line):
                                itemDrops[-1]['Probability'] = float(
                                    line.strip().replace('%', '')) / 100
                            elif ('Host' in line or 'Guest' in line):
                                itemDrops[-1]['Who'] = line.strip()
                            else:
                                [itemName, numItems] = line.strip().split('\t')
                                itemDrops.append(
                                    {'Item': itemName, 'Quantity': int(numItems.replace('*', ''))})

                        fieldData = itemDrops

                    rowPokemon[pokemonIndex][re.sub(
                        r'[^a-zA-Z0-9-_]', '', fieldName.replace(' ', ''))] = fieldData
                    rowDataIndex = newRowDataIndex + 1
                    pokemonIndex += 1
                    pokemonIndex %= len(rowPokemon)
            finally:
                records.extend(rowPokemon)
                allRecords.extend(rowPokemon)
                # print(rowPokemon[0])

    with open(outputFilename, 'w') as f:
        print(json.dumps(records), file=f)

# Get items from records
with open('./public/data/scarlet-violet/raid/items.json', 'w') as f:
    print(
        json.dumps(
            list(
                set([
                    item['Item'] for raid in allRecords for item in raid['ItemDrops']]
                    )
            )
        ),
        file=f
    )

with open('./public/data/scarlet-violet/raid/pokemon.json', 'w') as f:
    print(
        json.dumps(
            list(
                set([raid['Pokemon'] for raid in allRecords])
            )
        ),
        file=f
    )
