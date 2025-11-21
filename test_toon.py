import src.utils.toon as toon
import json

def test_toon():
    # Test 1: Simple Key-Value
    text1 = """
    key: value
    number: 123
    boolean: true
    """
    data1 = toon.loads(text1)
    print("Test 1:", data1)
    assert data1["key"] == "value"
    assert data1["number"] == 123
    assert data1["boolean"] == True

    # Test 2: Nested Object
    text2 = """
    parent:
      child: value
      nested:
        deep: true
    """
    data2 = toon.loads(text2)
    print("Test 2:", data2)
    assert data2["parent"]["child"] == "value"
    assert data2["parent"]["nested"]["deep"] == True

    # Test 3: List of Objects (CSV-like)
    text3 = """
    items:
      name, value, active
      Item 1, 100, true
      Item 2, 200, false
    """
    data3 = toon.loads(text3)
    print("Test 3:", data3)
    assert len(data3["items"]) == 2
    assert data3["items"][0]["name"] == "Item 1"
    assert data3["items"][0]["value"] == 100
    assert data3["items"][0]["active"] == True

    # Test 4: Mixed
    text4 = """
    meta:
      version: 1.0
    data:
      id, score
      A, 10
      B, 20
    """
    data4 = toon.loads(text4)
    print("Test 4:", data4)
    assert data4["meta"]["version"] == 1.0
    assert len(data4["data"]) == 2

    # Test 5: Serialization
    dumped = toon.dumps(data4)
    print("Dumped:\n", dumped)
    reloaded = toon.loads(dumped)
    print("Reloaded:", reloaded)
    assert reloaded == data4

    print("All tests passed!")

if __name__ == "__main__":
    test_toon()
