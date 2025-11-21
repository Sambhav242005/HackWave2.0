import re
import json

def loads(text: str) -> dict:
    """
    Parses a TOON formatted string into a Python dictionary.
    
    Format assumptions:
    - Key-value pairs: key: value
    - Nested objects: Indentation
    - Lists of objects: CSV-like table with header
    """
    lines = text.strip().split('\n')
    result = {}
    stack = [(result, -1)]  # (current_dict, indent_level)
    
    current_list_key = None
    current_list_headers = []
    current_list = []
    in_list_mode = False
    
    for line in lines:
        line = line.rstrip()
        if not line:
            continue
            
        indent = len(line) - len(line.lstrip())
        content = line.strip()
        
        # Handle list mode (CSV-like)
        if in_list_mode:
            # Check if we are still in the list block (indentation check)
            if indent <= stack[-1][1]:
                # End of list
                stack[-1][0][current_list_key] = current_list
                in_list_mode = False
                current_list_key = None
                current_list = []
                current_list_headers = []
            else:
                # Process list item
                values = [v.strip() for v in content.split(',')]
                item = {}
                for i, header in enumerate(current_list_headers):
                    if i < len(values):
                        val = values[i]
                        # Try to convert to numbers/bools
                        if val.lower() == 'true': val = True
                        elif val.lower() == 'false': val = False
                        else:
                            try:
                                if '.' in val: val = float(val)
                                else: val = int(val)
                            except ValueError:
                                pass
                        item[header] = val
                current_list.append(item)
                continue

        # Adjust stack based on indentation
        while stack and indent <= stack[-1][1]:
            stack.pop()
            
        current_dict = stack[-1][0]
        
        # Check for key: value
        if ':' in content:
            key, value = content.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            if not value:
                # It's a nested object or a list start
                # We need to peek ahead or assume based on context. 
                # For TOON, we'll assume if the next line is a header (no colon), it's a list.
                # But simpler: let's treat empty value as start of block.
                
                # We don't know if it's a dict or list yet. 
                # Let's assume dict for now, and switch to list if we see headers.
                new_obj = {}
                current_dict[key] = new_obj
                stack.append((new_obj, indent))
            else:
                # Simple key-value
                # Try to convert types
                if value.lower() == 'true': value = True
                elif value.lower() == 'false': value = False
                else:
                    try:
                        if '.' in value: value = float(value)
                        else: value = int(value)
                    except ValueError:
                        pass
                current_dict[key] = value
        else:
            # No colon, likely a list header or list item if we were in a list
            # If we just started a block (previous line was key:), this might be headers
            if stack[-1][0] == {}: # Empty dict we just created
                # Convert that empty dict to a list placeholder
                # We need to find the key for this... it's a bit tricky with the stack.
                # Let's actually look at the parent
                parent = stack[-2][0]
                # Find the key that points to current_dict
                # This is inefficient but works for now
                key_for_this = None
                for k, v in parent.items():
                    if v is stack[-1][0]:
                        key_for_this = k
                        break
                
                if key_for_this:
                    current_list_key = key_for_this
                    current_list_headers = [h.strip() for h in content.split(',')]
                    current_list = []
                    in_list_mode = True
                    # Remove the empty dict from parent
                    # We will assign the list later
                    pass
    
    # Cleanup if ended in list mode
    if in_list_mode and current_list_key:
         stack[-1][0][current_list_key] = current_list

    return result

def dumps(data: dict, indent: int = 0) -> str:
    """
    Serializes a dictionary to TOON format.
    """
    lines = []
    prefix = " " * indent
    
    for key, value in data.items():
        if isinstance(value, dict):
            lines.append(f"{prefix}{key}:")
            lines.append(dumps(value, indent + 2))
        elif isinstance(value, list):
            if not value:
                lines.append(f"{prefix}{key}: []")
                continue
            
            # Check if list of objects (dicts)
            if isinstance(value[0], dict):
                lines.append(f"{prefix}{key}:")
                headers = list(value[0].keys())
                lines.append(f"{prefix}  " + ", ".join(headers))
                for item in value:
                    row = []
                    for h in headers:
                        row.append(str(item.get(h, "")))
                    lines.append(f"{prefix}  " + ", ".join(row))
            else:
                # List of primitives
                lines.append(f"{prefix}{key}: " + ", ".join(map(str, value)))
        else:
            lines.append(f"{prefix}{key}: {value}")
            
    return "\n".join(lines)

def parse_response(text: str) -> dict:
    """
    Extracts and parses TOON content from an LLM response.
    """
    # Look for code blocks first
    match = re.search(r"```toon\n(.*?)\n```", text, re.DOTALL)
    if match:
        return loads(match.group(1))
        
    # Fallback: try to parse the whole text or look for the first key-value
    # This is a simplified heuristic
    try:
        return loads(text)
    except Exception:
        # If direct parsing fails, maybe it's wrapped in something else?
        # For now return empty or raise
        return {}
