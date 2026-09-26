"""Original surface textures and engineering details for the portfolio models."""
import math
import struct
import zlib
import bpy
from mathutils import Vector, noise


def png(path, width, height, pixels):
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)
    rows = b"".join(b"\0" + pixels[y * width * 4:(y + 1) * width * 4] for y in range(height))
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">2I5B", width, height, 8, 6, 0, 0, 0))
                     + chunk(b"IDAT", zlib.compress(rows, 9)) + chunk(b"IEND", b""))


def texture_material(name, color_path, rough_path=None, alpha=False):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    image = bpy.data.images.load(str(color_path), check_existing=True)
    image.pack()
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = image
    links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.9
    if alpha:
        mat.surface_render_method = "BLENDED"
        links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    if rough_path:
        rough_image = bpy.data.images.load(str(rough_path), check_existing=True)
        rough_image.colorspace_settings.name = "Non-Color"
        rough_image.pack()
        rough = nodes.new("ShaderNodeTexImage")
        rough.image = rough_image
        separate = nodes.new("ShaderNodeSeparateColor")
        links.new(rough.outputs["Color"], separate.inputs["Color"])
        links.new(separate.outputs["Green"], bsdf.inputs["Roughness"])
    return mat


def detailed_planet(sphere, material, source_dir):
    """A fictional terrestrial planet; all maps use continuous spherical noise."""
    folder = source_dir / "textures"
    folder.mkdir(exist_ok=True)
    width, height = 1024, 512
    colors, roughness, clouds = bytearray(), bytearray(), bytearray()
    clamp = lambda n: max(0, min(1, n))
    # Evaluate in 3D to avoid an equirectangular seam at the date line.
    for y in range(height):
        lat = math.pi * (0.5 - y / (height - 1))
        for x in range(width):
            lon = math.tau * x / (width - 1)
            p = Vector((math.cos(lat) * math.cos(lon), math.cos(lat) * math.sin(lon), math.sin(lat)))
            warp = noise.noise_vector(p * 2.1 + Vector((7, -3, 1))) * 0.36
            h = noise.fractal((p + warp) * 2.7 + Vector((2, 0, 9)), 1.0, 2.1, 6)
            fine = noise.fractal(p * 65, 0.8, 2.0, 3)
            land = h > 0.035
            if land:
                dry = clamp(1 - abs(abs(lat) - 0.43) * 3 + noise.noise(p * 5) * 0.8)
                ridge = abs(noise.fractal(p * 18, 0.9, 2, 4))
                elevation = clamp((h - 0.08) * 1.7 + ridge * 0.27)
                wet = (36, 67, 40)
                arid = (155, 130, 88)
                rgb = [wet[i] * (1 - dry) + arid[i] * dry for i in range(3)]
                rock = clamp((elevation - 0.27) * 3)
                rgb = [rgb[i] * (1 - rock) + (154, 150, 139)[i] * rock + fine * 20 for i in range(3)]
                if h < 0.055:
                    rgb = [157 + fine * 15, 147 + fine * 15, 111 + fine * 15]
                rough = 230
            else:
                shallow = clamp(1 + h * 17)
                rgb = [6 + shallow * 10, 23 + shallow * 28, 48 + shallow * 26]
                rough = 78
            ice = clamp((abs(lat) - 1.23 + noise.noise(p * 16) * 0.1) * 14)
            rgb = [rgb[i] * (1 - ice) + (216, 226, 229)[i] * ice for i in range(3)]
            # Swirled multi-scale cloud fields, from the same original noise source.
            weather = p * 5.3 + noise.noise_vector(p * 3.0 + Vector((12, 2, 1))) * 1.4
            coverage = noise.fractal(weather, 0.8, 2.1, 5)
            wisps = noise.fractal(p * 43 + warp * 3, 0.7, 2.0, 3)
            cloud = clamp((coverage - 0.03 + wisps * 0.12) * 2.8)
            shade = 1 - cloud * 0.15
            colors.extend([max(0, min(255, round(c * shade))) for c in rgb] + [255])
            roughness.extend([255, round(rough * (1 - ice) + 205 * ice), 0, 255])
            clouds.extend([239, 245, 250, round(cloud * 240)])
    png(folder / "planet-surface.png", width, height, colors)
    png(folder / "planet-roughness.png", width, height, roughness)
    png(folder / "planet-clouds.png", width, height, clouds)
    surface = texture_material("Oceans, coastlines and terrain", folder / "planet-surface.png", folder / "planet-roughness.png")
    atmosphere = texture_material("Cloud layer", folder / "planet-clouds.png", alpha=True)
    sphere("Terrestrial planet", (0, 0, 0), 1.5, surface, 96, 48)
    sphere("Cloud cover", (0, 0, 0), 1.512, atmosphere, 96, 48)
    haze = material("Atmospheric scattering", (0.15, 0.38, 0.8), 0, 1)
    haze.node_tree.nodes.get("Principled BSDF").inputs["Alpha"].default_value = 0.055
    haze.surface_render_method = "BLENDED"
    sphere("Atmosphere", (0, 0, 0), 1.528, haze, 96, 48)
    print("TEXTURES_READY: original planet surface, roughness and cloud maps", flush=True)


def bolt(name, center, axis, radius, rod, silver, dark):
    p, n = Vector(center), Vector(axis).normalized()
    rod(name + " washer", p, p + n * 0.008, radius * 1.35, silver, vertices=16, bevel=0)
    rod(name + " hex head", p + n * 0.008, p + n * 0.028, radius, silver, vertices=6, bevel=0)
    rod(name + " recess", p + n * 0.028, p + n * 0.029, radius * 0.47, dark, vertices=6, bevel=0)


def tube(name, points, radius, mat):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 12
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, co in zip(spline.bezier_points, points):
        point.co = co
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    return bpy.context.object


def refine_satellite(box, rod, ring, material):
    gold = bpy.data.materials["Warm anodized gold"]
    silver = bpy.data.materials["Brushed aluminum"]
    dark = bpy.data.materials["Graphite"]
    white = bpy.data.materials["Ceramic white"]
    # Unpainted aluminum support structure and physically dark blue cells.
    solar = bpy.data.materials["Indigo solar cells"]
    cell_bsdf = solar.node_tree.nodes.get("Principled BSDF")
    cell_bsdf.inputs["Base Color"].default_value = (0.008, 0.021, 0.075, 1)
    cell_bsdf.inputs["Metallic"].default_value = 0.48
    cell_bsdf.inputs["Roughness"].default_value = 0.24
    for obj in bpy.context.scene.objects:
        if obj.name.startswith("Photovoltaic cell"):
            obj.data.materials.clear()
            obj.data.materials.append(solar)
    # Crumpled thermal blankets: true triangulated surface geometry, not a flat gold box.
    for axis in (0, 1):
        for sign in (-1, 1):
            verts, faces = [], []
            nu, nv = 34, 40
            half = (0.494 if axis == 0 else 0.434)
            other = 0.4 if axis == 0 else 0.46
            for j in range(nv + 1):
                z = -0.53 + j / nv * 1.06
                for i in range(nu + 1):
                    u = -other + i / nu * other * 2
                    crease = noise.noise(Vector((u * 30, z * 30, axis * 4 + sign)), noise_basis="VORONOI_F2F1")
                    fine = noise.noise(Vector((u * 73, z * 73, 2)))
                    depth = (crease * 0.018 + fine * 0.006) * math.sin(math.pi * i / nu) * math.sin(math.pi * j / nv)
                    p = [u, sign * (half + depth), z]
                    if axis == 0:
                        p = [sign * (half + depth), u, z]
                    verts.append(p)
                    if i < nu and j < nv:
                        a = j * (nu + 1) + i
                        face1, face2 = (a, a + 1, a + nu + 2), (a, a + nu + 2, a + nu + 1)
                        if (axis == 0 and sign == -1) or (axis == 1 and sign == 1):
                            face1, face2 = tuple(reversed(face1)), tuple(reversed(face2))
                        faces.extend((face1, face2))
            mesh = bpy.data.meshes.new("Thermal blanket folds")
            mesh.from_pydata(verts, [], faces)
            mesh.update()
            obj = bpy.data.objects.new("Multi-layer insulation", mesh)
            bpy.context.collection.objects.link(obj)
            obj.data.materials.append(gold)
            for poly in mesh.polygons:
                poly.use_smooth = True
    gold.node_tree.nodes.get("Principled BSDF").inputs["Metallic"].default_value = 0.86
    gold.node_tree.nodes.get("Principled BSDF").inputs["Roughness"].default_value = 0.29
    # Cell busbars, hinges, panel seams and mounting fasteners.
    for side in (-1, 1):
        for face in (-1, 1):
            for col in range(6):
                x = side * (0.89 + col * 0.277 + 0.137)
                for row in range(4):
                    z = -0.54 + row * 0.277 + 0.13
                    for offset in (-0.075, 0, 0.075):
                        box("Cell silver busbar", (x + offset, face * 0.063, z), (0.003, 0.003, 0.237), silver, 0)
        for x in (1.16, 1.99):
            box("Solar panel splice", (side * x, 0, 0), (0.018, 0.105, 1.17), silver, 0.004)
        for z in (-0.45, 0.45):
            rod("Array diagonal brace", (side * 0.52, 0.05, 0), (side * 0.88, 0, z), 0.018, silver, vertices=12)
        rod("Hinge drum", (side * 0.74, -0.13, 0), (side * 0.74, 0.13, 0), 0.1, dark)
        for y in (-0.44, 0.44):
            for z in (-0.51, 0.51):
                bolt("Bus frame bolt", (side * 0.47, y, z), (0, -1 if y < 0 else 1, 0), 0.022, rod, silver, dark)
        tube("Array power harness", [(side * 0.4, 0.25, -0.22), (side * 0.63, 0.25, -0.3),
                                    (side * 0.87, 0.08, -0.16)], 0.016, dark)
    # Rear radiator, louvered heat rejection, dual attitude-control thrusters.
    box("Radiator panel", (0, 0.453, 0.03), (0.7, 0.035, 0.79), white, 0.012)
    for i in range(10):
        box("Radiator louver", (0, 0.48, -0.31 + i * 0.072), (0.61, 0.014, 0.028), silver, 0.003)
    for x in (-0.33, 0.33):
        rod("Attitude thruster mount", (x, 0, -0.63), (x, 0, -0.75), 0.065, silver)
        rod("Attitude thruster nozzle", (x, 0, -0.75), (x, 0, -0.87), 0.043, dark, 0.085)
        rod("Thruster nozzle throat", (x, 0, -0.866), (x, 0, -0.872), 0.063, dark)
    # Back of antenna: concentric stiffeners and slender radial ribs.
    for radius in (0.25, 0.44, 0.59):
        ring("Antenna rear stiffener", radius, 0.009, silver,
             center=(0, 0, 0.832 + radius * radius * 0.58))
    for i in range(12):
        a = i / 12 * math.tau
        tube("Antenna radial rib", [(r * math.cos(a), r * math.sin(a), 0.83 + r * r * 0.58)
                                    for r in (0.15, 0.3, 0.46, 0.65)], 0.009, silver)
    rod("Antenna feed receiver", (0, 0, 1.26), (0, 0, 1.39), 0.055, silver, 0.035)
    tube("Antenna coaxial cable", [(0.06, 0.05, 0.64), (0.22, 0.06, 0.74), (0.18, 0.1, 0.84)], 0.013, dark)
    rod("Telemetry antenna", (0.3, 0.28, 0.61), (0.38, 0.3, 1.12), 0.012, silver, vertices=12)
    box("Sensor mounting flange", (0, -0.507, 0.15), (0.43, 0.035, 0.39), dark, 0.02)
    for x in (-0.17, 0.17):
        for z in (0.01, 0.29):
            bolt("Sensor screw", (x, -0.531, z), (0, -1, 0), 0.016, rod, silver, dark)


def refine_robot(box, rod, ring, material):
    silver = bpy.data.materials["Brushed aluminum"]
    dark = bpy.data.materials["Graphite"]
    white = bpy.data.materials["Ceramic white"]
    blue = bpy.data.materials["Cobalt blue"]
    white.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = (0.57, 0.6, 0.59, 1)
    white.node_tree.nodes.get("Principled BSDF").inputs["Roughness"].default_value = 0.38
    blue.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = (0.025, 0.065, 0.14, 1)
    blue.node_tree.nodes.get("Principled BSDF").inputs["Roughness"].default_value = 0.32
    # Machined bearing covers with fastening circles and gasket seams.
    for center, radius in (((0, 0, 0.7), 0.26), ((-0.62, 0, 1.85), 0.22), ((0.44, 0, 2.38), 0.17)):
        x, y, z = center
        for side in (-1, 1):
            ring("Bearing seal", radius * 0.9, 0.009, dark, (x, side * 0.299, z), (math.pi / 2, 0, 0))
            ring("Machined concentric face", radius * 0.58, 0.005, silver, (x, side * 0.324, z), (math.pi / 2, 0, 0))
            for i in range(8):
                a = math.tau * i / 8
                bolt("Joint cover screw", (x + radius * 0.67 * math.cos(a), side * 0.321,
                                            z + radius * 0.67 * math.sin(a)), (0, side, 0), 0.015, rod, silver, dark)
        box("Joint service cover", (x + radius * 0.35, 0.1, z + radius * 0.58),
            (radius * 0.9, 0.24, radius * 0.5), white, 0.025)
    # Electrical conduit follows each link and flexes around the elbow.
    tube("Main flexible wiring harness", [(0.2, 0.22, 0.44), (0.08, 0.38, 0.82),
         (-0.58, 0.38, 1.56), (-0.8, 0.37, 1.87), (-0.58, 0.37, 2.13),
         (0.22, 0.25, 2.52), (0.57, 0.16, 2.33)], 0.042, dark)
    tube("Pneumatic supply line", [(0.22, 0.29, 0.54), (0.13, 0.42, 0.83),
         (-0.49, 0.43, 1.63), (-0.68, 0.4, 1.95), (-0.42, 0.4, 2.1),
         (0.25, 0.3, 2.43), (0.72, 0.21, 2.19)], 0.012, silver)
    for t in (0.18, 0.4, 0.62, 0.82):
        p = Vector((0, 0, 0.7)).lerp(Vector((-0.62, 0, 1.85)), t)
        box("Upper arm service rail", (p.x, 0.19, p.z), (0.16, 0.06, 0.055), silver, 0.008)
        bolt("Service rail bolt", (p.x, 0.225, p.z), (0, 1, 0), 0.014, rod, silver, dark)
    # Base encoder housing, power connector and cooling fins.
    ring("Turntable gasket", 0.455, 0.012, dark, center=(0, 0, 0.29))
    ring("Base machined lip", 0.635, 0.012, silver, center=(0, 0, 0.125))
    box("Base electrical service box", (0, 0.4, 0.3), (0.39, 0.22, 0.27), blue, 0.035)
    for x in (-0.11, 0.11):
        rod("Power connector shell", (x, 0.5, 0.3), (x, 0.57, 0.3), 0.055, silver)
        rod("Power connector insert", (x, 0.57, 0.3), (x, 0.577, 0.3), 0.036, dark)
    for i in range(7):
        box("Motor cooling fin", (-0.21 + i * 0.07, -0.395, 0.29), (0.024, 0.045, 0.13), dark, 0.004)
    for i in range(8):
        a = math.tau * i / 8
        bolt("Foundation bolt", (0.53 * math.cos(a), 0.53 * math.sin(a), 0.177), (0, 0, 1), 0.032, rod, silver, dark)
    # Gripper slide rails, jaws, knurled pads and pneumatic cylinders.
    for side in (-1, 1):
        rod("Gripper guide rail", (0.63, side * 0.23, 2.17), (0.85, side * 0.23, 2.17), 0.025, silver)
        bolt("Jaw pivot", (0.75, side * 0.257, 2.08), (0, side, 0), 0.022, rod, silver, dark)
        for i in range(5):
            box("Gripper pad groove", (0.92, side * 0.118, 1.806 + i * 0.011), (0.075, 0.013, 0.004), silver, 0)
    tube("Wrist cable", [(0.47, 0.2, 2.49), (0.79, 0.28, 2.39), (0.85, 0.17, 2.2)], 0.022, dark)
