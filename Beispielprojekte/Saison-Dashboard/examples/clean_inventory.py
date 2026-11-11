"""Eigene Referenz an erfundenen Lagerdaten, keine echten Spielerbeobachtungen.

Lesestellen: https://pandas.pydata.org/docs/user_guide/missing_data.html
und https://docs.python.org/3/library/decimal.html
Die negative Bestandsmenge ist hier ungültig; negative Kickbase-Punkte sind es nicht.
"""
from decimal import Decimal, InvalidOperation


def clean_inventory(records):
    accepted, rejected = [], []
    seen_skus = set()
    for record in records:
        sku = record.get('sku')
        if not isinstance(sku, str) or not sku.strip() or sku.strip() in seen_skus:
            rejected.append({'sku': sku, 'reason': 'fehlender oder doppelter Schlüssel'})
            continue
        sku = sku.strip()
        seen_skus.add(sku)
        raw_quantity = record.get('quantity')
        try:
            quantity = None if raw_quantity is None else Decimal(str(raw_quantity))
            if quantity is not None and (
                not quantity.is_finite() or quantity < 0 or quantity != quantity.to_integral_value()
            ):
                raise ValueError
        except (InvalidOperation, ValueError):
            rejected.append({'sku': sku, 'reason': 'ungültige Bestandsmenge'})
            continue
        accepted.append({'sku': sku, 'quantity': None if quantity is None else int(quantity)})
    return {'accepted': accepted, 'rejected': rejected}


if __name__ == '__main__':
    sample = [{'sku': ' A ', 'quantity': '0'}, {'sku': 'B', 'quantity': None},
              {'sku': 'A', 'quantity': '7'}, {'sku': 'C', 'quantity': '-2'}]
    print('Erfundene Lagerdaten:', clean_inventory(sample))
